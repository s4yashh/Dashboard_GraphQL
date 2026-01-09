import { gql } from "@apollo/client";

export const GET_USER_DBS = gql`
  query GetUserDbs {
    userDbs {
      documentId
      Name
      email
      is_active
      phone
    }
  }
`;
