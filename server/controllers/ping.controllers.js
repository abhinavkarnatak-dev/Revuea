const pingHandler = (req, res) => {
  return res.status(200).json({ message: "pong" });
};

export { pingHandler };