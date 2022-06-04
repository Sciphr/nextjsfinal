import MeetupList from "../components/meetups/MeetupList";

import Head from "next/head";
import { MongoClient } from "mongodb";
import { Fragment } from "react";

// const DUMMY_MEETUPS = [
//   {
//     id: "m1",
//     title: "A First Meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some address 5, 12345 Some City",
//     description: "This is a first meetup",
//   },
//   {
//     id: "m2",
//     title: "A Second Meetup",
//     image:
//       "https://upload.wikimedia.org/wikipedia/commons/d/d3/Stadtbild_M%C3%BCnchen.jpg",
//     address: "Some address 22, 12345 Some City",
//     description: "This is a second meetup",
//   },
// ];

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse the list of things man. Just look man. Come on. Man"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

//This does NOT run during build process, but always running after deployment
//** No revalidate property since this function constantly runs */
// export const getServerSideProps = async (context) => {
//   const req = context.req; //Request
//   const res = context.res; //Response
//   // fetch data from API
//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// };

// Pre render page at build time using props from this function
// Use when data required to render, is available before the user requests it (aka: build time)
// Great for SEO
// ****THIS CODE WILL NOT BE SHOWN ON THE CLIENT SIDE. THEREFORE YOUR CREDENTIALS ARE SAFE****
export const getStaticProps = async () => {
  // fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://Jacob:canada99@atlascluster.tb7ob.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  //.find is async, finds ALL documents in noSQL database
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        //Have to destructure 'meetups' collection because the 'id' that is auto generated in MongoDB is a complex object that has to be converted to a String. Therefore we destructure each element/property of a collection, to allow us to convert the ID individual/separate from the other properties
        id: meetup._id.toString(),
      })),
    },
    //update in seconds
    revalidate: 1,
  };
};

export default HomePage;
