import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/components/Button";
import Access from "../common/access";
import { useContext, ChangeEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { prescriptionContext } from "@/store/prescriptionContext";
import { dataPass } from "@/lib/types.ts";
import { api } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const vitals: Array<{
  id: string;
  label: string;
  name: keyof dataPass;
  placeholder: string;
}> = [
  {
    id: "bp",
    label: "Blood Pressure",
    name: "bp",
    placeholder: "Enter Blood Pressure",
  },
  { id: "spo2", label: "SpO2", name: "spo2", placeholder: "Enter SpO2" },
  {
    id: "temperature",
    name: "temperature",
    label: "Temperature",
    placeholder: "Enter Temperature",
  },
  {
    id: "heart_rate",
    label: "Heart Rate",
    name: "heart_rate",
    placeholder: "Enter Heart Rate",
  },
  { id: "bmi", label: "BMI", name: "bmi", placeholder: "Enter BMI" },
  {
    id: "glucose",
    label: "Glucose",
    name: "glucose",
    placeholder: "Enter Glucose",
  },
  {
    id: "respiratory_rate",
    label: "Respiratory Rate",
    name: "respiratory_rate",
    placeholder: "Enter Respiratory Rate",
  },
];

const prescriptionFields = [
  { id: "history", label: "History", placeholder: "Enter medical history" },
  { id: "co", label: "C/o", placeholder: "Enter chief complaints" },
  { id: "allergy", label: "Allergy(s)", placeholder: "Enter allergies" },
  {
    id: "investigation",
    label: "Investigation(s)",
    placeholder: "Enter investigations",
  },
  {
    id: "diagnosis-icd",
    label: "Diagnosis (ICD Code & Description)",
    placeholder: "Enter ICD diagnosis",
  },
  { id: "prognosis", label: "Prognosis", placeholder: "Enter prognosis" },
  {
    id: "advice",
    label: "Doctor’s Advice / Recommendations",
    placeholder: "Enter advice",
  },
];

type Medicine = {
  m_id: string;
  frequency: string;
  duration: string;
  instructions: string;
};

type InputValue = {
  paramedic_notes: string;
  vitals: {
    bp: string;
    spo2: string;
    temperature: string;
    heart_rate: string;
    bmi: string;
    glucose: string;
    respiratory_rate: string;
    pregnant: boolean;
  };
  treatment_plan: {
    history: string;
    co: string;
    allergy: string;
    investigation: string;
    diagnosis: string;
    prognosis: string;
    advice: string;
  };
  medicine: Medicine[];
  referred_outside?: boolean;
  rest_recommendation?: string;
  follow_up_date?: string;
};

export default function Prescribe() {
  const navigate = useNavigate();
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isPharmacyMedicationOpen, setIsPharmacyMedicationOpen] =
    useState(false);

  const { prescription } = useContext(prescriptionContext);

  const [inputValue, setInputValue] = useState<InputValue>({
    paramedic_notes: "",
    vitals: {
      bp: prescription.bp || "",
      spo2: prescription.spo2 || "",
      temperature: prescription.temperature || "",
      heart_rate: prescription.heart_rate || "",
      pregnant: prescription.pregnant || false,
      bmi: prescription.bmi || "",
      glucose: prescription.glucose || "",
      respiratory_rate: prescription.respiratory_rate || "",
    },
    treatment_plan: {
      history: "",
      co: "",
      allergy: "",
      investigation: "",
      diagnosis: "",
      prognosis: "",
      advice: "",
    },
    medicine: [],
    referred_outside: false,
    rest_recommendation: "",
    follow_up_date: "",
  });

  console.log("Initial input Values : ", inputValue);
  console.log("Prescription : ", prescription);
  console.log("Prescription ID : ", prescription._id);

  async function submitPrescriptionForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("After Final Input Values : ", inputValue);
    try {
      const response = await api.post("/doctor/prescription", {
        prescription_id: prescription._id,
        doctor_id: "67d6a54f84ae5b5080fd855a",
        paramedic_notes: inputValue.paramedic_notes,
        vitals: inputValue.vitals,
        treatment_plan: inputValue.treatment_plan,
        medicine: inputValue.medicine,
        referred_outside: inputValue.referred_outside,
        rest_recommendation: inputValue.rest_recommendation,
        follow_up_date: inputValue.follow_up_date,
      });
      console.log("API Response: ", response);
      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/app/doctor/patientqueue");
      }, 6000);
    } catch (error) {
      toast.error("Error while saving prescription details.");
      console.error(error);
    }
  }

  const handleVitalChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setInputValue((prev) => ({
      ...prev,
      vitals: {
        ...prev.vitals,
        [id]: value,
      },
    }));
  };

  async function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const { name, checked } = target;
      setInputValue((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    } else {
      const { name, value } = target;
      setInputValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  function handleMedicineChange(
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const { name, value } = e.target;
    setInputValue((prevState) => {
      const updatedMedicines = [...prevState.medicine];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [name]: value,
      };
      return { ...prevState, medicine: updatedMedicines };
    });
  }

  const addMedicineButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInputValue((prevState) => ({
      ...prevState,
      medicine: [
        ...prevState.medicine,
        { m_id: "", frequency: "", duration: "", instructions: "" },
      ],
    }));
  };

  function removeMedicineButton(index: number) {
    setInputValue((prevState) => ({
      ...prevState,
      medicine: prevState.medicine.filter((_, i) => i !== index),
    }));
  }

  return (
    <Access text={["doctor"]}>
      <ToastContainer />
      <div className="p-6 bg-zinc-100 ">
        <h1 className="text-4xl font-semibold mb-6 pl-5">
          Patient Prescription
        </h1>
        <div className="space-y-6 bg-white p-8 rounded-2xl">
          <form
            className="space-y-6 max-w-7xl mx-auto "
            onSubmit={submitPrescriptionForm}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Patient Details</h2>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-gray-500">Name</Label>
                  <p className="font-medium">{prescription.name}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Roll No/Staff ID</Label>
                  <p className="font-medium">{prescription.roll_no}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Gender</Label>
                  <p className="font-medium">{prescription.gender}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Age</Label>
                  <p className="font-medium">{prescription.age}</p>
                </div>
                <div className="space-y-1 ">
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-medium">{prescription.email}</p>
                </div>
                <div className="space-y-1 ">
                  <Label className="text-gray-500">Mobile Number</Label>
                  <p className="font-medium">{prescription.mobile_no}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Paramedic Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter paramedic notes"
                  className="h-24"
                  name="paramedic_notes"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Vitals */}
            <Collapsible
              open={isVitalsOpen}
              onOpenChange={setIsVitalsOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">Vitals</h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isVitalsOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  {vitals.map(({ id, label, name, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Input
                        id={id}
                        placeholder={placeholder}
                        defaultValue={String(prescription?.[name] ?? "")}
                        onChange={handleVitalChanges}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Prescription */}
            <Collapsible
              open={isPrescriptionOpen}
              onOpenChange={setIsPrescriptionOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">Prescription</h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isPrescriptionOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  {prescriptionFields.map(({ id, label, placeholder }) => (
                    <div key={id} className="space-y-2">
                      <Label htmlFor={id}>{label}</Label>
                      <Textarea
                        id={id}
                        placeholder={placeholder}
                        name={`treatment_plan.${id}`}
                        value={(inputValue.treatment_plan as any)[id]}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const key = name.split(".")[1];
                          setInputValue((prevState) => ({
                            ...prevState,
                            treatment_plan: {
                              ...prevState.treatment_plan,
                              [key]: value,
                            },
                          }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* In Pharmacy Medication */}
            <Collapsible
              open={isPharmacyMedicationOpen}
              onOpenChange={setIsPharmacyMedicationOpen}
              className="border rounded-lg"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-gray-50">
                <h2 className="text-lg font-semibold">
                  In Pharmacy Medication
                </h2>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isPharmacyMedicationOpen ? "transform rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Sr No.</TableHead>
                      <TableHead>Medicine</TableHead>
                      <TableHead>Frequency/Day</TableHead>
                      <TableHead>Duration(Days)</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead className="w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inputValue.medicine.map((med, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter medicine"
                            name="m_id"
                            value={med.m_id || ""}
                            onChange={(e) => handleMedicineChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter frequency"
                            name="frequency"
                            value={med.frequency || ""}
                            onChange={(e) => handleMedicineChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter duration"
                            name="duration"
                            value={med.duration || ""}
                            onChange={(e) => handleMedicineChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Enter instructions"
                            name="instructions"
                            value={med.instructions || ""}
                            onChange={(e) => handleMedicineChange(e, index)}
                          />
                        </TableCell>
                        <TableCell>
                          <button onClick={() => removeMedicineButton(index)}>
                            Remove
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Add Medicine Button */}
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="w-full h-full flex justify-center items-center">
                          <button
                            onClick={addMedicineButton}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all duration-300 "
                          >
                            Add Medicine
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>

            {/* Additional Fields */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="referred_outside"
                  name="referred_outside"
                  onChange={handleChange}
                ></input>
                <Label htmlFor="referred_outside">Referred Outside?</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Rest Recommendation */}
                <div className="space-y-2">
                  <Label htmlFor="rest_recommendation">Recommend Rest?</Label>
                  <Textarea
                    id="rest_recommendation"
                    name="rest_recommendation"
                    placeholder={"Enter rest recommendation"}
                    value={inputValue.rest_recommendation || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Follow-Up Date */}
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Follow-Up Date</Label>
                  <div className="w-40">
                    <Input
                      id="follow_up_date"
                      type="date"
                      name="follow_up_date"
                      value={inputValue.follow_up_date || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Details</Button>
            </div>
          </form>
        </div>
      </div>
    </Access>
  );
}
