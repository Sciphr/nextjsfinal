//domain.com/*dynamic id*
import { MongoClient, ObjectId } from "mongodb";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { Fragment } from "react";
import Head from "next/head";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Description for {props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
    //props: as that is the name used in the 'getStaticProps' function. And in that function, IN the 'props', we define the property of: meetupData
  );
};

//
export const getStaticPaths = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://Jacob:canada99@atlascluster.tb7ob.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // means: search the whole collection, but only filter for _id. Then convert to an array
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
};

export const getStaticProps = async (context) => {
  //fetch data for a single meetup//

  const meetupId = context.params.meetupId; //context.params.meetupId -> meetupId is from the square brackets (dynamic URL) we established in the folder for this page

  const client = await MongoClient.connect(
    "mongodb+srv://Jacob:canada99@atlascluster.tb7ob.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // means: search for ONE document, with filters in the brackets. We are searching in the _id field in MongoDB, using the 'meetupId' we establish in the 'getStaticPaths' function
  //We are also converting the 'object' of _id using the MongoDB hook called 'ObjectId'. Then we destructure in the return statement
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
};

export default MeetupDetails;
