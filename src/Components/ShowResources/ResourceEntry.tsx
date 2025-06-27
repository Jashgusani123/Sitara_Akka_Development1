import { Snackbar } from '@mui/material';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetSubdata } from '../../APIs/GetAPIs';
import type { RootState } from '../../Redux/Store';
import Loading from '../Loading';
import ResourceSubdata from './ResourceSubdata';

interface Props {
  expandedEntryId: string,
  setExpandedEntryId: (id: string | null) => void,
  setExpandedSubId: (id: string | null) => void,
  setExpandedItemId: (id: string | null) => void,
  id: string,
  type: string,
  parentId: string;
  expandedSubId: string | null;
  expandedItemId: string | null;
}

const ResourceEntry = ({
  expandedEntryId,
  setExpandedEntryId,
  setExpandedSubId,
  setExpandedItemId,
  id,
  type,
  parentId,
  expandedSubId,
  expandedItemId,
}: Props) => {

  const [Message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const subDataMap = useSelector((state: RootState) => state.subData.subDataMap);
  const dispatch = useDispatch();

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

  const handleSubdataFetch = (entryId: string) => {
    const isExpanded = expandedEntryId === entryId;
    setExpandedEntryId(isExpanded ? null : entryId);
    setExpandedSubId(null);

    if (!isExpanded && !subDataMap[entryId] && entryId) {
      GetSubdata({ resourceDataEntryId: entryId, dispatch });
    }
  };


  const currentSubData = subDataMap[id] || [];

  return (
    <>
      <div className="flex justify-between items-center ">
        <span className="text-gray-700 font-medium cursor-pointer" onClick={() => handleSubdataFetch(id)}>
          {type}
        </span>
      </div>

      <AnimatePresence>
        {expandedEntryId === id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 space-y-2"
          >
            {
              id in subDataMap ? (
                currentSubData.length > 0 ? (
                  currentSubData.map((sub) => {
                    const isArray = sub.datatype === "array";
                    const isSubExpanded = expandedSubId === sub._id;

                    return (
                      <div
                        key={sub._id}
                        className="flex flex-col gap-1 bg-blue-200 border-1 border-blue-400 px-3 py-2 rounded-md "
                      >
                        <ResourceSubdata
                          isArray={isArray}
                          isSubExpanded={isSubExpanded}
                          expandedItemId={expandedItemId}
                          type={sub.datatype}
                          link={sub.link}
                          setExpandedSubId={setExpandedSubId}
                          setExpandedItemId={setExpandedItemId}
                          id={sub._id}
                          parentId={id}
                          outerParentId ={parentId}
                          subject={sub.name}
                        />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-zinc-500 text-sm">Not Added Yet.</p>
                )
              ) : (
                <Loading />
              )
            }
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
};

export default ResourceEntry;