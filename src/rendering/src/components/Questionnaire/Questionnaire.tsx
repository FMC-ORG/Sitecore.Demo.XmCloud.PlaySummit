import {
  Field,
  Text,
  withDatasourceCheck,
  RichTextField,
  ImageField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { QuestionnaireQuestion } from './QuestionnaireQuestion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { logAudiencePreferenceEvent as logAudiencePreferenceEventCloudSDK } from 'src/services/CloudSDKService';
import { GraphQLSession } from 'src/types/session';
import SessionItem from 'components/Sessions/SessionItem';

type QuestionnaireProps = ComponentProps & {
  fields: {
    data: {
      datasource: {
        title: { jsonValue: Field<string> };
        questions: {
          results: QuestionnaireQuestion[];
        };
      };
      sessions: {
        children: {
          results: extendedGraphQLSession[];
        };
      };
    };
  };
};

type extendedGraphQLSession = GraphQLSession & {
  audience: {
    targetItems: {
      name: Field<string>;
    }[];
  };
  type: {
    jsonValue: Field<string>;
  };
};

export type QuestionnaireQuestion = {
  id: string;
  title: { jsonValue: Field<string> };
  body: { jsonValue: RichTextField };
  options: {
    results: QuestionnaireOption[];
  };
};

export type QuestionnaireOption = {
  id: string;
  text: { jsonValue: Field<string> };
  image: { jsonValue: ImageField };
  audience: { jsonValue: Field };
  sessionType: { jsonValue: Field };
};

const Questionnaire = (props: QuestionnaireProps): React.JSX.Element => {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState('');

  const [selectedAudience, setSelectedAudience] = useState('');
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [sessionResults, setSessionResults] = useState<extendedGraphQLSession[]>([]);

  const datasource = useMemo(
    () => props.fields?.data?.datasource,
    [props.fields?.data?.datasource]
  );
  const questions = useMemo(
    () => datasource?.questions?.results ?? [],
    [datasource?.questions?.results]
  );
  // Deleted/unpublished sessions and sessions without audience/type tags are tolerated.
  const sessions = useMemo(
    () => (props.fields?.data?.sessions?.children?.results ?? []).filter((s) => s?.url?.path),
    [props.fields?.data?.sessions?.children?.results]
  );

  // This is temporary and will not be needed after Search implementation
  useEffect(() => {
    const typeOf = (session: extendedGraphQLSession) => session.type?.jsonValue?.value;
    const audienceOf = (session: extendedGraphQLSession) =>
      session.audience?.targetItems?.[0]?.name?.value;
    const sessionsByType = [
      ...sessions.filter((session) => typeOf(session) === selectedSessionType),
      ...sessions.filter((session) => typeOf(session) !== selectedSessionType),
    ];

    const sessionsByAudienceAndType = [
      ...sessionsByType.filter((session) => audienceOf(session) === selectedAudience),
      ...sessionsByType.filter((session) => audienceOf(session) !== selectedAudience),
    ];

    setSessionResults(sessionsByAudienceAndType.slice(0, 4));
  }, [selectedAudience, selectedSessionType, sessions]);

  const handleOptionSelect = useCallback(
    (option: QuestionnaireOption) => {
      setSelectedOptionId(option.id);

      const audience = option.audience?.jsonValue?.value as string;
      const sessionType = option.sessionType?.jsonValue?.value as string;

      const goToNext = () => {
        setCurrQuestionIndex(currQuestionIndex + 1);
        setShowResults(currQuestionIndex + 1 >= questions?.length);
        setSelectedOptionId('');
      };

      if (!!audience) {
        // Record the native AUDIENCE_PREFERENCE event without blocking the visitor: a slow or
        // unavailable Edge endpoint, missing configuration or edit/preview mode must not stall the UI.
        logAudiencePreferenceEventCloudSDK(audience).catch((e) =>
          console.debug('Native audience event unavailable.', e)
        );

        setSelectedAudience(audience);
        goToNext();
      }

      if (!!sessionType) {
        // TODO: Send data to Search instead of timeout
        setTimeout(() => {
          setSelectedSessionType(sessionType);
          goToNext();
        }, 700);
      }

      if (!audience && !sessionType) {
        setTimeout(() => {
          goToNext();
        }, 700);
      }
    },
    [currQuestionIndex, questions?.length]
  );

  const restartQuestionnaire = useCallback(() => {
    setSelectedAudience('');
    setSelectedSessionType('');
    setCurrQuestionIndex(0);
    setShowResults(false);
  }, []);

  return (
    <section className="questionnaire">
      {questions?.map((question, i) => (
        <QuestionnaireQuestion
          key={question.id}
          visible={currQuestionIndex === i}
          selectedOptionId={selectedOptionId}
          {...question}
          onOptionSelect={(option) => handleOptionSelect(option)}
        />
      ))}
      {showResults && (
        <div className="questionnaire-recommendations">
          <div className="questionnaire-recommendations-header">
            <Text tag="h3" field={datasource?.title?.jsonValue} />
            <button
              className="btn-secondary btn-secondary-light"
              onClick={() => restartQuestionnaire()}
            >
              Start over
            </button>
          </div>
          <div className="questionnaire-recommendations-content item-grid sessions-grid">
            <div className="questionnaire-recommendations-grid grid-content">
              {!!sessionResults.length &&
                sessionResults.map((session) => (
                  <SessionItem key={session.url.path} session={session} />
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const Default = withDatasourceCheck()<QuestionnaireProps>(Questionnaire);
