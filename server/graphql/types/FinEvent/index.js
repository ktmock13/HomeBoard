export default `
  type FinEvent {
    id: String!
    datetime: String!
    amount: Float!
    desc: String!
  }
  type Query {
    finEvent(id: String!): FinEvent
    finEvents: [FinEvent]
  }
  type Mutation {
    addFinEvent(id: String!, datetime: String!, amount: Float!, desc: String!): FinEvent
    editFinEvent(id: String!, datetime: String!, amount: Float!, desc: String!): FinEvent
    deleteFinEvent(id: String!, datetime: String!, amount: Float!, desc: String!): FinEvent
  }
`;