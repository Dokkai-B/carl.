import { motion } from "framer-motion"

// Variants
const stairAnimation = {
    initial: {
        top: "0%",
    },
    animate: {
        top: "100%",
    },
    exit: {
        top: ["100%", "0%"],

    },
};

// Calculate the reverse index fat staggered delay
const reverseIndex = (index) => {
    const totalSteps = 6; //number of steps
    return totalSteps - index - 1;
};

const Stairs = () => {
    return (
        <>

            {/* render 6 motion divs, each representing a step of the stairs. 
  Each div will have the same animation defined by the stairsAnimation object. The delay for each div is calculated dinamically based on it's reversed index, creating a staggered effects with decreasing delay for each subsequent step.
  */}
            {[...Array(6)].map((_, index) => {
                return (
                    <motion.div
                        key={index}
                        variants={stairAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{
                            duration: 0.4,
                            ease: "easeInOut",
                            delay: reverseIndex(index) * 0.1,
                        }}
                        style={{ backgroundColor: "#0d1a27" }} // Set the background color using a hex value
                        className="h-full w-full relative"
                    />
                );
            })}
        </>
    );
};

export default Stairs