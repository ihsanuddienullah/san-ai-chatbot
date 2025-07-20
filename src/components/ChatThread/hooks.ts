import { MessageProps } from "./_components/Message";

const useCustom = () => {
  const welcomeMessage: MessageProps = {
    role: "assistant",
    content: "Welcome to the San AI Chatbot! How can I assist you today?",
  };

  return {
    data: {
      welcomeMessage,
    },
  };
};

export default useCustom;
