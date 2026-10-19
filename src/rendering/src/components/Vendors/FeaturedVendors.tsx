import Link from 'next/link';
import { Text, Field, Image, withDatasourceCheck, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { Vendor } from 'src/types/vendor';

type FeaturedVendorsProps = ComponentProps & {
  fields: {
    Title: Field<string>;
    Subtitle: Field<string>;
    Vendors: Vendor[];
  };
};

const FeaturedVendors = (props: FeaturedVendorsProps): React.JSX.Element => {
  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;
  const hasVendors = !!props?.fields?.Vendors?.length;

  const sxaStyles = `${props.params?.styles || ''}`;

  !hasVendors && console.warn('Missing Datasource Item');

  const pageEditingMissingDatasource = !hasVendors && isPageEditing && (
    <p>Missing Datasource Item</p>
  );

  // Pass the name value as alt text; deleted/unpublished multilist targets are skipped.
  const vendors = (props.fields?.Vendors ?? [])
    .filter((vendor) => vendor?.url)
    .map((vendor, index) => (
      <Link key={index} href={vendor.url} passHref className="grid-item">
        <Image
          field={vendor.fields?.Logo}
          alt={vendor.fields?.Name?.value}
          width={265}
          height={265}
        />
        <div className="item-details">
          <Text tag="p" field={vendor.fields?.Name} />
        </div>
      </Link>
    ));

  const featuredVendors = hasVendors && (
    <section className={`section section-light ${sxaStyles}`}>
      <div className="section-content container">
        <Text className="section-content-title" tag="h1" field={props.fields?.Title} />
        <Text className="section-content-subtitle-center" tag="p" field={props.fields?.Subtitle} />

        <div className="item-grid">
          <div className="grid-content">{vendors}</div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      {featuredVendors}
      {pageEditingMissingDatasource}
    </>
  );
};

export const Default = withDatasourceCheck()<FeaturedVendorsProps>(FeaturedVendors);
