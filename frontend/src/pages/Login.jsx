import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    Button,
  } from "@material-tailwind/react";
  import { Link } from "react-router-dom";
   
  export default function LoginCard() {
    return (
      <div 
      className=" min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(155, 143, 143, 0.8), rgba(255, 255, 255, 0.8)), 
        url('https://th.bing.com/th/id/OIP.nLlxitLDCgisRaAh44NfPgHaGX?w=220&h=189&c=7&r=0&o=5&dpr=2&pid=1.7')`,
      }}
    >
      <div className="relative">
        <Card className="w-96 shadow-xl">
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-4 grid h-28 place-items-center"
        >
          <Typography variant="h3" color="white">
            Sign In
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Input label="Email" size="lg" />
          <Input label="Password" size="lg" />
          <div className="-ml-2.5">
            <Checkbox label="Remember Me" />
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Link to='/Home'>
          <Button variant="gradient" fullWidth>
            Login In
          </Button>
          </Link>
          <Typography variant="small" className="mt-6 flex justify-center">
            Don&apos;t have an account?
            <Typography
              as="a"
              href="/signup"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Sign up
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
    </div>
    );
  }