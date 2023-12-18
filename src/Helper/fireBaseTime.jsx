const fireBaseTime = (data) => {
  const { seconds, nanoseconds } = data || { seconds: 0, nanoseconds: 0 }

  return new Date(
    seconds * 1000 + nanoseconds / 1000000,
  )
};

export default fireBaseTime;