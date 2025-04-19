import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import config from "./../../config";
import { useParams } from "react-router-dom";

export default function NewBoardingRequest() {
  const [availableCages, setAvailableCages] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCage, setSelectedCage] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [petName, setPetName] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vendorId } = useParams();

  useEffect(() => {
    fetchAvailableCages();
  }, []);

  useEffect(() => {
    calculateTotalAmount();
  }, [startDate, endDate, selectedCage]);

  const fetchAvailableCages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch cages data from the API
      const response = await axios.get(`${config.baseURL}/api/cages`);
      // Filter for available cages only
      const availableCages = response.data.filter(
        (cage) => cage.status === "Available"
      );
      setAvailableCages(availableCages);
    } catch (error) {
      console.error("Error fetching available cages:", error);
      setError("Failed to load available cages. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (cage) => {
    setSelectedCage(cage);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setStartDate("");
    setEndDate("");
    setPetName("");
    setSpecialInstructions("");
    setTotalAmount(0);
  };

  const calculateTotalAmount = () => {
    if (!startDate || !endDate || !selectedCage) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    // Calculate number of days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate total amount (minimum 1 day)
    const days = Math.max(1, diffDays);
    const total = days * selectedCage.dailyRate;

    setTotalAmount(total);
  };

  const handleSubmitBooking = async () => {
    // Validate form
    if (!startDate || !endDate || !petName) {
      alert("Please fill all required fields");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (start >= end) {
      alert("End date must be after start date");
      return;
    }

    try {
      // Create booking object based on input
      const bookingData = {
        cageId: selectedCage._id,
        startDate,
        endDate,
        petName,
        specialInstructions,
        totalAmount,
      };

      // Submit booking to API
      await axios.post(`${config.baseURL}/api/bookings`, bookingData);

      // Show success message
      alert(`Booking successful! Your total is $${totalAmount}`);

      // Close dialog and refresh cages
      handleCloseDialog();
      fetchAvailableCages();
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  // Helper function to display placeholder if no image available
  const getCageImage = (cage) => {
    return (
      cage.imageUrl ||
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography>Loading available cages...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography color="red">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Typography variant="h2" className="text-center mb-8">
        Available Boarding Options
      </Typography>

      {availableCages.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="h5" color="blue-gray">
            No available cages at the moment
          </Typography>
          <Typography color="gray" className="mt-2">
            Please check back later or contact us for more information.
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCages.map((cage) => (
            <Card key={cage._id} className="overflow-hidden">
              <CardHeader
                shadow={false}
                floated={false}
                className="h-48 bg-gray-100">
                <img
                  src={getCageImage(cage)}
                  alt={`Cage ${cage.cageNumber}`}
                  className="h-full w-full object-cover"
                />
              </CardHeader>
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Typography variant="h5" color="blue-gray">
                    Cage #{cage.cageNumber}
                  </Typography>
                  <Typography
                    color="blue-gray"
                    className="flex items-center gap-1.5 font-bold">
                    ${cage.dailyRate}
                    <Typography
                      as="span"
                      color="blue-gray"
                      className="text-sm font-normal">
                      /day
                    </Typography>
                  </Typography>
                </div>
                <Typography color="gray" className="mb-3 font-normal">
                  Dimensions: {cage.dimensions}
                </Typography>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold opacity-75">
                  Status: {cage.status}
                </Typography>
                <div className="mt-4 pt-2">
                  <Button
                    fullWidth
                    color="orange"
                    onClick={() => handleOpenDialog(cage)}>
                    Book Now
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex flex-col items-start">
          <Typography variant="h4">
            Book Cage #{selectedCage?.cageNumber}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            ${selectedCage?.dailyRate} per day
          </Typography>
        </DialogHeader>
        <DialogBody divider className="overflow-y-auto">
          <div className="space-y-6">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Booking Details
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-medium">
                    Start Date
                  </Typography>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-medium">
                    End Date
                  </Typography>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-medium">
                Pet Name
              </Typography>
              <Input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter your pet's name"
                required
              />
            </div>

            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 font-medium">
                Special Instructions (Optional)
              </Typography>
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requirements for your pet"
                rows={3}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Booking Summary
              </Typography>
              {startDate && endDate && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Typography color="gray">Accommodation:</Typography>
                    <Typography color="blue-gray" className="font-medium">
                      Cage #{selectedCage?.cageNumber}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography color="gray">Price per day:</Typography>
                    <Typography color="blue-gray" className="font-medium">
                      ${selectedCage?.dailyRate}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography color="gray">Duration:</Typography>
                    <Typography color="blue-gray" className="font-medium">
                      {Math.max(
                        1,
                        Math.ceil(
                          Math.abs(new Date(endDate) - new Date(startDate)) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}{" "}
                      days
                    </Typography>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <Typography color="blue-gray" className="font-semibold">
                        Total Amount:
                      </Typography>
                      <Typography color="blue-gray" className="font-bold">
                        ${totalAmount}
                      </Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button color="green" onClick={handleSubmitBooking}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
