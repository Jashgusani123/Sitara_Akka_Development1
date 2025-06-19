import { useState } from "react";
import CreateResourceDialog from "./CreateResourceDialog"; // Step 1
import {ResourceDataEntryDialog} from "./ResourceDataEntryDialog"; // Step 2
import { SubDataUploadDialog } from "./SubDataUploadDialog"; // Step 3
import CreateResourceItemForm from "./CreateResourceItemForm"; // Step 4

const CreateFullResource = () => {
  const [step, setStep] = useState(1);
  const [resourceId, setResourceId] = useState<string | null>(null);
  const [resourceDataEntryId, setResourceDataEntryId] = useState<string | null>(null);
  const [subDataId, setSubDataId] = useState<string | null>(null);

  const goNext = (data: any) => {
    if (step === 1) {
      setResourceId(data._id); // resource
      setStep(2);
    } else if (step === 2) {
      setResourceDataEntryId(data._id); // resourceDataEntry
      setStep(3);
    } else if (step === 3) {
      setSubDataId(data._id); // subData
      setStep(4);
    } else if (step === 4) {
      resetFlow();
    }
  };

  const resetFlow = () => {
    setStep(1);
    setResourceId(null);
    setResourceDataEntryId(null);
    setSubDataId(null);
  };

  return (
    <>
      {step === 1 && <CreateResourceDialog onNext={goNext} />}
      {step === 2 && resourceId && <ResourceDataEntryDialog resourceId={resourceId} onNext={goNext} />}
      {step === 3 && resourceDataEntryId && <SubDataUploadDialog resourceDataEntryId={resourceDataEntryId} onNext={goNext} />}
      {step === 4 && subDataId && <CreateResourceItemForm subDataId={subDataId} onClose={goNext} />}
    </>
  );
};

export default CreateFullResource;
