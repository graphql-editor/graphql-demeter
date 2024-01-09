/** @type {import('graphql-demeter-core').FakerConfig} */
const config = {
  objects: {
    Card:{
      description:{
        type:"values",
        values:["Very powerful card", "Most fire resistant character", "Good melee fighter"]
      },
      name:{
        type:"values",
        values:["Zeus", "Athena", "Hera", "Ares", "Kronos"]
      },
      image:{
        type:"faker",
        key:"internet.avatar"
      }
    }
  },
  scalars: {},
};
module.exports = config