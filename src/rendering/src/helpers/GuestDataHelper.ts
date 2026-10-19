type GuestData = {
  email: string;
  firstName: string;
  lastName: string;
};

/** The XMC-only demo does not prefill forms from archived legacy CDP profiles. */
export const getUserData = async (): Promise<GuestData> => ({
  email: '',
  firstName: '',
  lastName: '',
});
