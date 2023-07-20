import { Request, Response, NextFunction } from "express";

interface Ierror {
  name: string,
  account: string,
  password: string,
}

function validSignUp(req: Request, res: Response, next: NextFunction) {
  const { name, account, password } = req.body;
  let error: Ierror = {
    name: '', account: '',
    password: ''
  };
  if (!name)
    error.name = "Please add your name."
  else if (name.length > 20)
    error.name = "Your name should be upto max 20 characters"


  if (!account)
    error.account = "Please add your Email or Phone no."
  else if (!validPhone(account) && !validEmail(account))
    error.account = "Email or phone format is incorrect"


  if (password.length < 3)  // less then 3 for testing purpose only
    error.password = "Password must be at least 8 chars."

  if (error.name || error.account || error.password)
    return res.status(400).json({ error: error })
  next();
}

function validEmail(email: string) {
  const re: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validPhone(phone: string) {
  const re: RegExp = /^\+[1-9]\d{1,14}$/;
  return re.test(phone)
}
export { validSignUp, validEmail, validPhone }