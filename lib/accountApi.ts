import { graphqlRequest } from "./graphqlClient";

export async function updatePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const data = await graphqlRequest<{ updatePassword: boolean }>(
    `mutation UpdatePassword($oldPassword: String!, $newPassword: String!) {
      updatePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }`,
    {
      variables: { oldPassword, newPassword },
      auth: true,
    }
  );
  return data.updatePassword;
}

export async function deleteAccount(): Promise<boolean> {
  const data = await graphqlRequest<{ deleteMember: boolean }>(
    `mutation DeleteMember { deleteMember }`,
    { auth: true }
  );
  return data.deleteMember;
}
