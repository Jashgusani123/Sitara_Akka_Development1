import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Snackbar } from '@mui/material';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetEntries } from '../../APIs/GetAPIs';
import { deleteResource } from '../../APIs/PostAPIs';
import type { RootState } from '../../Redux/Store';
import CreateResourceDialog from '../CreateResourcesSteps/CreateResourceDialog';
import { ResourceDataEntryDialog } from '../CreateResourcesSteps/ResourceDataEntryDialog';
import Loading from '../Loading';
import ResourceEntry from './ResourceEntry';

interface Props {
  expandedSubject?: string | null,
  setExpandedSubject: (id: string | null) => void,
  setExpandedSubId: (id: string | null) => void,
  setExpandedItemId: (id: string | null) => void,
  id: string,
  isAdmin?: boolean,
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
  isAdmin,
  subject,
  expandedEntryId,
  expandedSubId,
  expandedItemId
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentSubId, setCurrentSubId] = useState<string | null>(null);
  const [showFormForEdit, setshowFormForEdit] = useState(false);
  const [Message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dispatch = useDispatch();
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

    setExpandedSubject(id); // fixed: use id, not subject
    setExpandedEntryId(null);
    setExpandedSubId(null);

    const isAvailable = !!entriesMap[resourceId];
    if (!isAvailable && resourceId) {
      GetEntries({ resourceId, dispatch });
    }
  };

  const handleAddEntry = (resourceId: string) => {
    setCurrentSubId(resourceId);
    setShowForm(true);
  };

  const handleRequestEdit = () => {
    setshowFormForEdit(true);
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
        {isAdmin && (
          <div className="flex gap-2">
            <button
              className="bg-green-400 text-white rounded-xl px-4 py-1 cursor-pointer hover:bg-green-500 text-sm transition"
              onClick={handleRequestEdit}
            >
              Edit
            </button>
            <button
              className="bg-red-400 text-white rounded-xl px-4 py-1 cursor-pointer hover:bg-red-500 text-sm transition"
              onClick={() => deleteResource({ id, at: "resources", setMessage, dispatch })}
            >
              Delete
            </button>
            <button onClick={() => handleAddEntry(id)}>
              <ControlPointIcon style={{ color: "black", cursor: "pointer" }} />
            </button>
          </div>
        )}
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
                    className="flex flex-col gap-2 bg-zinc-100 px-4 py-3 rounded-lg shadow-sm"
                  >
                    <ResourceEntry
                      expandedEntryId={expandedEntryId || ""}
                      expandedItemId={expandedItemId || ""}
                      setExpandedEntryId={setExpandedEntryId}
                      setExpandedSubId={setExpandedSubId}
                      setExpandedItemId={setExpandedItemId}
                      parentId={id}
                      id={entry._id}
                      isAdmin={!!isAdmin}
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

      {showForm && currentSubId && (
        <ResourceDataEntryDialog
          resourceId={currentSubId}
          onClose={() => setShowForm(false)}
        />
      )}

      {showFormForEdit && (
        <CreateResourceDialog
          handleEditRequest={true}
          open={showFormForEdit}
          resourceId={id}
          onClose={() => setshowFormForEdit(false)}
        />
      )}

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