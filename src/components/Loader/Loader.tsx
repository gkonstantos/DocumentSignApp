/*
 * @Author: Peter Fousteris (petfoust@gmail.com)   
 * @Date: 2023-01-30 17:00:59 
 * @Last Modified by: Peter Fousteris (petfoust@gmail.com)
 * @Last Modified time: 2023-06-03 15:28:53
 */


import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { EventTypes } from "../../common";

export const Loader: React.FunctionComponent = React.memo(() => {
    const [show, setShow] = useState<boolean>();
	// const { start, stop } = useDelayed();

    // useGlobalListener(EventTypes.ACTION_LOADING, () => {
    //     setShow(true);
    //     stop();
    // }, [setShow, stop]);

    // useGlobalListener(EventTypes.ACTION_FINISHED, () => {
    //     start(() => {
    //         setShow(false);
    //     },500);
    // }, [setShow, start]);


    const load = PubSub.subscribe(
        EventTypes.ACTION_LOADING,
        () => setShow(true)
    );

    const done = PubSub.subscribe(
        EventTypes.ACTION_FINISHED,
        () => setShow(false)
    );

    // const subscription = PubSub.subscribe(EventTypes.REFRESH, () => setShow(true));

    return (
        <AnimatePresence>
            {show && (
                <motion.div className="absolute top-0 z-20 h-full w-full bg-gradient-to-t from-gray-500 via-gray-600 to-gray-700"
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: .5,
                        transition: {
                            duration: .6,
                        }
                    }}
                    exit={{
                        opacity: 0,
                        transition: {
                            delay: .15,
                        }
                    }}
                >

                </motion.div>
            )}
        </AnimatePresence>
    )
});

export default Loader;