import Image from "next/image";
import PortalImage from "@/../public/portal.png";
import ChestClosed from "@/../public/chest-closed.png";
import ChestOpened from "@/../public/chest-opened.png";

export default function Home() {
  return (
    <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
      {/* <main className="flex gap-8 row-start-2 justify-center items-center sm:items-start dark-purple-bg"> */}
      {/* <Image src={ChestClosed} alt="Chest Closed" width={200} height={200} /> */}
      <div className="w-[100%] flex justify-center items-center">
        <Image src={ChestOpened} alt="Chest Opened" width={300} height={300} />
        <Image src={PortalImage} alt="Portal" width={300} height={300} />
      </div>

      {/* </main> */}
    </div>
  );
}
