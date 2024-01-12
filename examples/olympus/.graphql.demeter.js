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
        fake: "image.people"
      }
    },
    S3Object:{
      bucket:{
        fake: "address.country"
      },
      region:{
        fake: "address.country"
      },
    }
  },
  scalars: {
    JSON:{
      values: [JSON.stringify({__metadata:"blalbalbla"}), JSON.stringify({__secret:"dsajd89u98"})]
    }
  },
};
module.exports = config