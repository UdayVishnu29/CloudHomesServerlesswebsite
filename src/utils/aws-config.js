import { Amplify } from "aws-amplify";

const awsConfig = {
  Auth: {
    region: "ap-sount-1", // Replace with your actual region if different
    userPoolId: "ap-south-1_REUfLX4Mk", // Replace with your actual User Pool ID
    userPoolWebClientId: "7rtfd646oglmmr7gk2gbu906tm", // Your actual Client ID
  },
};
// Safe configurat
console.log("AWS Config:", awsConfig);

// Configure Amplify
Amplify.configure(awsConfig);

export default awsConfig;
