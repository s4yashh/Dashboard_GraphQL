import { gql } from "@apollo/client";

export const CREATE_USER_DB = gql`
  mutation CreateUserDb($data: UserDbInput!) {
    createUserDb(data: $data) {
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

export const UPDATE_USER_DB = gql`
  mutation UpdateUserDb($id: ID!, $data: UserDbInput!) {
    updateUserDb(id: $id, data: $data) {
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

export const DELETE_USER_DB = gql`
  mutation DeleteUserDb($id: ID!) {
    deleteUserDb(id: $id) {
      data {
        id
      }
    }
  }
`;
