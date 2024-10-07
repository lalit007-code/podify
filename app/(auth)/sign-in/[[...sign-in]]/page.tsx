import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="flex flex-center glassmorphism-auth h-screen w-full ">
      <SignIn />
    </div>
  );
};

export default page;
