Task: https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/graphql-service/assignment.md
Deadline: 2023-01-31 04:00

Basic Scope
+72 Task 1: restful endpoints.
+72 Subtasks 2.1-2.7: get gql queries.
+54 Subtasks 2.8-2.11: create gql queries.
+54 Subtasks 2.12-2.17: update gql queries.
+88 Task 3: solve n+1 graphql problem.
+20 Task 4: limit the complexity of the graphql queries.

Score: 72

Query

2.1. Get users, profiles, posts, memberTypes - 4 operations in one query:

```
{
  users {
    firstName
    email
    lastName
    subscribedToUserIds
    id
  }
  profiles {
    avatar
    birthday
    city
    country
    id
    memberTypeId
    sex
    street
    userId
  }
  posts {
    content
    id
    title
    userId
  }
  memberTypes {
    discount
    id
    monthPostsLimit
  }
}
```
