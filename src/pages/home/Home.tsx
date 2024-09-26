// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import "./App.css";
// import { Input } from "./components/ui/input";
// import { z } from "zod";
// import { Button } from "./components/ui/button";
// import {
//   REACT_APP_AWS_ACCESS_KEY_ID,
//   REACT_APP_AWS_SECRET_ACCESS_KEY,
//   REACT_APP_AWS_REGION,
// } from "./config";

// const App: React.FC = () => {
// const webcamRef = useRef<Webcam | null>(null);
// const [imageSrc, setImageSrc] = useState<string | null>(null);
// const [cameraOn, setCameraOn] = useState(false);
// const [email, setEmail] = useState("");
// const [name, setName] = useState("");
// const [password, setPassword] = useState("");
// const [confirmPassword, setConfirmPassword] = useState("");
// const [phoneNumber, setPhoneNumber] = useState("");
// const [imageLink, setImageLink] = useState("");
//   const videoConstraints = {
//     facingMode: "user",
//   };

//   // Initialize S3 client globally
//   const s3Client = new S3Client({
//     region: REACT_APP_AWS_REGION,
//     credentials: {
//       accessKeyId: REACT_APP_AWS_ACCESS_KEY_ID,
//       secretAccessKey: REACT_APP_AWS_SECRET_ACCESS_KEY,
//     },
//   });

//   const capturePhoto = async () => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setImageSrc(imageSrc as string);

//       const stream = webcamRef.current.video?.srcObject as MediaStream;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       setCameraOn(false);
//     }
//   };

//   const validateSignUpSchema = (data: {
//     name: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//     phoneNumber: string;
//     image: string;
//   }) => {
//     const signUpSchema = z
//       .object({
//         name: z.string().nonempty("Name is required"),
//         email: z.string().email("Invalid email address"),
//         password: z.string().min(8, "Password must be at least 8 characters"),
//         confirmPassword: z
//           .string()
//           .min(8, "Confirm Password must be at least 8 characters"),
//         phoneNumber: z.string().nonempty("Phone number is required"),
//         image: z.string().nonempty("Image is required"),
//       })
//       .refine((data) => data.password === data.confirmPassword, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"],
//       });

//     return signUpSchema.safeParse(data);
//   };

//   const handleSignUp = async () => {
//     const validationResponse = validateSignUpSchema({
//       name,
//       email,
//       password,
//       confirmPassword,
//       phoneNumber,
//       image: imageLink,
//     });

//     if (!validationResponse.success) {
//       const errorMessages = validationResponse.error.errors
//         .map((err) => err.message)
//         .join(", ");
//       throw new Error(errorMessages);
//     }

//     const url = `http://localhost:4000/api/users/register`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: name,
//         email: email,
//         password: password,
//         confirmPassword: confirmPassword,
//         phoneNumber: phoneNumber,
//         image: imageLink,
//       }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.error_msg || "Error ");
//     }

//     const data = await response.json();
//     return data;
//   };

//   // const handleSignUp = async () => {
//   //   const url = `http://localhost:4000/api/users/register`;

//   //   const response = await fetch(url, {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify({
//   //       name: name,
//   //       email: email,
//   //       password: password,
//   //       confirmPassword: confirmPassword,
//   //       phoneNumber: phoneNumber,
//   //       image: imageLink,
//   //     }),
//   //   });

//   //   if (!response.ok) {
//   //     const data = await response.json();
//   //     throw new Error(data.error_msg || "Error ");
//   //   }

//   //   const data = await response.json();
//   //   return data;
//   // };

//   useEffect(() => {
//     uploadToAws();
//   }, [imageSrc, email]);

//   const uploadToAws = async () => {
//     if (imageSrc && email) {
//       const base64Image = imageSrc.split(",")[1];
//       const binaryImage = atob(base64Image);
//       const arrayBuffer = new ArrayBuffer(binaryImage.length);
//       const uint8Array = new Uint8Array(arrayBuffer);

//       for (let i = 0; i < binaryImage.length; i++) {
//         uint8Array[i] = binaryImage.charCodeAt(i);
//       }

//       const blob = new Blob([uint8Array], { type: "image/jpeg" });

//       const imageParams = {
//         Bucket: "face-authen",
//         Key: `facialdata/profile_images/${email}.jpg`,
//         Body: blob,
//         ContentType: "image/jpeg",
//       };

//       try {
//         // Upload the image using the new AWS S3 V3 SDK
//         const command = new PutObjectCommand(imageParams);
//         const data = await s3Client.send(command);
//         if (data) {
//           const imageUrl = `https://face-authen.s3.us-east-1.amazonaws.com/facialdata/profile_images/${email}.jpg`;
//           setImageLink(imageUrl);
//           console.log("Image uploaded successfully. URL:", imageUrl);
//         }
//         // console.log("Image uploaded successfully:", data);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }
//   };

//   const handleCaptureButtonClick = () => {
//     setCameraOn(true);
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-4 ">
//         {/* <input
//           placeholder="name"
//           onChange={(e) => setName(e.target.value)}
//           className="h-14 w-[360px] rounded-full p-7 border-none border-1  border-[#282829] bg-[#1D1D1D]
//           text-[#AAAAAA]"
//         />
//         <input
//           placeholder="phone"
//           onChange={(e) => setPhoneNumber(e.target.value)}
//         />
//         <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

//         <input
//           placeholder="password"
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <input
//           placeholder="confirm password"
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         /> */}

//         <Input
//           type="text"
//           placeholder="Name"
//           onChange={(e) => setName(e.target.value)}
//         />
//         <Input
//           type="text"
//           placeholder="Phone"
//           onChange={(e) => setPhoneNumber(e.target.value)}
//         />

//         <Input
//           type="email"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <Input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <Input
//           type="password"
//           placeholder="Confirm Password"
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />
//       </div>
//       <div>
//         {!cameraOn && (
//           <Button onClick={handleCaptureButtonClick}>
//             Activate Camera & Capture Photo
//           </Button>
//         )}

//         {cameraOn && (
//           <div>
//             <Webcam
//               audio={false}
//               height={400}
//               ref={webcamRef}
//               screenshotFormat="image/jpeg"
//               width={400}
//               videoConstraints={videoConstraints}
//             />
//             <button onClick={capturePhoto}>Capture Photo</button>
//           </div>
//         )}

//         {imageSrc && (
//           <div>
//             <h2>Captured Photo:</h2>
//             <img src={imageSrc} alt="Captured" />
//           </div>
//         )}
//       </div>

//       {/* <button onClick={handleSignUp}>SignUp</button> */}
//       <Button onClick={handleSignUp} className="bg-red-500">
//         SignUp
//       </Button>
//     </>
//   );
// };

// export default App;

const Home = () => {
  return <div>Home</div>;
};

export default Home;
