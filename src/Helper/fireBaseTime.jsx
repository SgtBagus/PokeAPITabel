const fireBaseTime = ({ seconds, nanoseconds }) => {
  return new Date(
    seconds * 1000 + nanoseconds / 1000000,
  )
};

export default fireBaseTime;