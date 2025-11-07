import DogRunnerCanvas from '@/components/DogRunnerCanvas';

const Page = () => {
  return (
    <main>
      <h1>Street Run Pup</h1>
      <p>
        Watch a lively animation of a spirited dog sprinting through a midnight street,
        complete with city lights and a rhythmic stride.
      </p>
      <DogRunnerCanvas />
      <p className="footer">Made with love, motion, and a wagging tail.</p>
    </main>
  );
};

export default Page;
