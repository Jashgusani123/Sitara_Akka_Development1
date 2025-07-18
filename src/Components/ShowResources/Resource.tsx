import { Snackbar } from '@mui/material';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import {  useSelector } from 'react-redux';
// import { GetEntries } from '../../APIs/GetAPIs';
import type { RootState } from '../../Redux/Store';
import Loading from '../Loading';
import ResourceEntry from './ResourceEntry';

interface Props {
  expandedSubject?: string | null,
  setExpandedSubject: (id: string | null) => void,
  setExpandedSubId: (id: string | null) => void,
  setExpandedItemId: (id: string | null) => void,
  id: string,
  subject: string,
  setExpandedEntryId: (id: string | null) => void,
  expandedEntryId: string | null,
  expandedSubId: string | null,
  expandedItemId: string | null
}

function Resource({
  expandedSubject,
  setExpandedSubject,
  setExpandedEntryId,
  setExpandedSubId,
  setExpandedItemId,
  id,
  subject,
  expandedEntryId,
  expandedSubId,
  expandedItemId
}: Props) {
  const [Message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const dispatch = useDispatch();
  const entriesMap = useSelector((state: RootState) => state.entries.entriesMap);

  useEffect(() => {
    if (Message !== "") {
      setOpenSnackbar(true);
      const timer = setTimeout(() => {
        setOpenSnackbar(false);
        setMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [Message]);

  const handleEntriesRequest = (resourceId: string) => {
    const isAlreadyExpanded = expandedSubject === id;

    if (isAlreadyExpanded) {
      setExpandedSubject(null);
      setExpandedEntryId(null);
      setExpandedSubId(null);
      return;
    }

    setExpandedSubject(id); 
    setExpandedEntryId(null);
    setExpandedSubId(null);

    const isAvailable = !!entriesMap[resourceId];
    if (!isAvailable && resourceId) {
      // GetEntries({ resourceId, dispatch });
    }
  };

  const entryList = entriesMap[id];

  return (
    <>
      <div className="flex justify-between items-center">
        <span
          onClick={() => handleEntriesRequest(id)}
          className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer"
        >
          {subject}
        </span>

      </div>

      <AnimatePresence>
        {expandedSubject === id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {entryList?.length !== 0 ? (
              entryList ? (
                entryList.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex flex-col gap-2 shadow-gray-400 shadow-sm bg-yellow-100 border-1 border-yellow-200 px-4 py-3 rounded-lg "
                  >
                    <ResourceEntry
                      expandedEntryId={expandedEntryId || ""}
                      expandedItemId={expandedItemId || ""}
                      setExpandedEntryId={setExpandedEntryId}
                      setExpandedSubId={setExpandedSubId}
                      setExpandedItemId={setExpandedItemId}
                      parentId={id}
                      id={entry._id}
                      expandedSubId={expandedSubId}
                      type={entry.type}
                    />
                  </div>
                ))
              ) : (
                <Loading />
              )
            ) : (
              <p className='text-zinc-500 text-sm'>Not Added Yet.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      <Snackbar
        open={openSnackbar}
        message={Message}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            backgroundColor: "#FFD004",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
          },
        }}
      />
    </>
  );
}

export default Resource;