import { AuthVideoCard } from "./AuthCardCommon";

const VerifyAuthCapture = ({
  onVerificationComplete,
}: {
  onVerificationComplete?: () => void;
}) => {
  return (
    <AuthVideoCard
      mode="capture"
      onVerificationComplete={onVerificationComplete}
    />
  );
};
export default VerifyAuthCapture;
