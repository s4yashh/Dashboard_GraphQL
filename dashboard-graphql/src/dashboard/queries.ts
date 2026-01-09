import { gql } from "@apollo/client";

export const GET_USER_DBS = gql`
  query {
    userDbs {
      data {
        id
        attributes {
          Name
          email
          phone
          is_active
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const GET_USER_DB = gql`
  query GetUserDb($id: ID!) {
    userDb(id: $id) {
      data {
        id
        attributes {
          Name
          email
          phone
          is_active
          createdAt
          updatedAt
        }
      }
    }
  }
`;
