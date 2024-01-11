/** @type {import('graphql-demeter-core').FakerConfig} */
const config = {
  objects: {
    Card:{
      description:{
        values:["Very powerful card", "Most fire resistant character", "Good melee fighter"]
      },
      name:{
        values:["Zeus", "Athena", "Hera", "Ares", "Kronos"]
      },
      image:{
        key: "image.people"
      }
    }
  },
  scalars: {},
};
module.exports = config