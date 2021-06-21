import { useState } from "react";  
const Mutation = () => {
  const [status] = useState({}); // { type, msg }
  const sendMessage = (payload) => {
    console.log(payload);
  }; // { key, msg }
  return { status, sendMessage };
};
const Query = () => {
  const [status] = useState({}); // { type, msg }
  const sendMessage = (payload) => {
    console.log(payload);
  }; // { key, msg }
  return { status, sendMessage };
};
const Subscription = () => {
  const [status] = useState({}); // { type, msg }
  const sendMessage = (payload) => {
    console.log(payload);
  }; // { key, msg }
  return { status, sendMessage };
};
export {Mutation as MUTATION, Query as QUERY, Subscription as SUBSCRIPTION };