import React, { useState } from "react";

import { EyeSlash, Eye } from "@phosphor-icons/react";
const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? (
    <Eye size={20} onClick={() => setVisible(!visible)} />
  ) : (
    <EyeSlash size={20} onClick={() => setVisible(!visible)} />
  );
  const InputType = visible ? "text" : "password";
  return { InputType, Icon };
};

export default usePasswordToggle;
