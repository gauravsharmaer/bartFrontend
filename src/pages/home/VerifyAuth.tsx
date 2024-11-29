import { AuthVideoCard } from "./AuthCardCommon";

const VerifyAuth = ({
  onVerificationComplete,
}: {
  onVerificationComplete?: () => void;
}) => {
  return (
    <AuthVideoCard
      mode="verify"
      onVerificationComplete={onVerificationComplete}
    />
  );
};
export default VerifyAuth;
