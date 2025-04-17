import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Avatar, Button} from "@heroui/react";

export default function VetCard() {
  const [isBooked, setIsBooked] = React.useState(false);

  const vets = [
    {
      name: "Dr. Sarah Wilson",
      specialization: "Small Animal Specialist",
      avatar: "/images/vet-1.jpg",
      experience: "15 years",
      patients: "2.5K",
      rating: "4.9"
    },
    {
      name: "Dr. James Cooper",
      specialization: "Emergency Veterinarian",
      avatar: "/images/vet-2.jpg",
      experience: "10 years",
      patients: "1.8K",
      rating: "4.8"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4 pt-20">
      {vets.map((vet, index) => (
        <Card className="max-w-[340px]" key={index}>
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={vet.avatar}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">{vet.name}</h4>
                <h5 className="text-small tracking-tight text-default-400">{vet.specialization}</h5>
              </div>
            </div>
            <Button
              className={isBooked ? "bg-transparent text-foreground border-default-200" : ""}
              color="primary"
              radius="full"
              size="sm"
              variant={isBooked ? "bordered" : "solid"}
              onPress={() => setIsBooked(!isBooked)}
            >
              {isBooked ? "Cancel Booking" : "Book Appointment"}
            </Button>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <p>Professional veterinarian with {vet.experience} of experience in animal care.</p>
            <span className="pt-2">
              Available for consultations and emergency care
              <span aria-label="veterinary" className="py-2 ml-2" role="img">
                🏥
              </span>
            </span>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">{vet.rating}</p>
              <p className="text-default-400 text-small">Rating</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">{vet.patients}</p>
              <p className="text-default-400 text-small">Patients</p>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}