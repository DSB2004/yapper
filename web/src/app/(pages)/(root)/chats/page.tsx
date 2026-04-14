import Chats from "@/components/chats/panel/chats";
import Window from "@/components/chats/window";

export default function page() {
  return (
    <>
      <div className="border-r w-96 flex flex-col">
        <Chats></Chats>
      </div>
      <Window></Window>
    </>
  );
}
