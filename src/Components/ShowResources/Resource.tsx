import ControlPointIcon from '@mui/icons-material/ControlPoint';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GetEntries } from '../../APIs/GetAPIs';
import type { RootState } from '../../Redux/Store';
import CreateResourceDialog from '../CreateResourcesSteps/CreateResourceDialog';
import { ResourceDataEntryDialog } from '../CreateResourcesSteps/ResourceDataEntryDialog';
import Loading from '../Loading';
import ResourceEntry from './ResourceEntry';
import { Snackbar } from '@mui/material';
import { deleteResource } from '../../APIs/PostAPIs';
interface Props {
  expandedSubject?: string | null,
  setExpandedSubject: (id: string | null) => void,
  setExpandedSubId: (id: string | null) => void,
  id: string,
  isAdmin?: boolean,
  subject: string,
  setExpandedEntryId: (id: string | null) => void,
  expandedEntryId: string | null,
  expandedSubId: string | null
}

function Resource({
  expandedSubject,
  setExpandedSubject,
  setExpandedEntryId,
  setExpandedSubId,
  id,
  isAdmin,
  subject,
  expandedEntryId,
  expandedSubId
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentSubId, setCurrentSubId] = useState<string | null>(null);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [showFormForEdit, setshowFormForEdit] = useState(false);
  const [Message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const entriesMap = useSelector((state: RootState) => state.entries.entriesMap);
  const user = useSelector((state: RootState) => state.user.user);

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
  const handleEntriesRequest = (resourceId: string, subjectName: string) => {
    const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
    if (!user && !token) {
      setShowLoginWarning(true);
      return;
    }

    const isAlreadyExpanded = expandedSubject === subjectName;

    if (isAlreadyExpanded) {
      setExpandedSubject(null);
      setExpandedEntryId(null);
      setExpandedSubId(null);
      return;
    }

    setExpandedSubject(subjectName);
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
    setshowFormForEdit(true)
  };

  const entryList = entriesMap[id];

  return (
    <>
      <div className="flex justify-between items-center">
        <span
          onClick={() => handleEntriesRequest(id, subject)}
          className="text-lg font-semibold text-blue-700 hover:underline cursor-pointer"
        >
          {subject}
        </span>
        {isAdmin && (
          <div className="flex gap-2">
            <button className="bg-green-400 text-white rounded-xl px-4 py-1 cursor-pointer hover:bg-green-500 text-sm transition" onClick={handleRequestEdit}>
              Edit
            </button>
            <button
              className="bg-red-400 text-white rounded-xl px-4 py-1 cursor-pointer hover:bg-red-500 text-sm transition"
              onClick={() => deleteResource({ id, at: "resources", setMessage , dispatch })}
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
        {expandedSubject === subject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {entryList?.length !== 0 ? <>
              {entryList ? (
                entryList.map((entry) => (
                  <div
                    key={entry._id}
                    className="flex flex-col gap-2 bg-zinc-100 px-4 py-3 rounded-lg shadow-sm"
                  >
                    <ResourceEntry
                      expandedEntryId={expandedEntryId || ""}
                      setExpandedEntryId={setExpandedEntryId}
                      setExpandedSubId={setExpandedSubId}
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
              )}
            </> : <p className='text-zinc-500 text-sm '>Not Added Yet.</p>}

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

      {showLoginWarning && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="bg-amber-100 rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-1 "><InfoOutlinedIcon fontSize='large' /> Login Required</h2>
            <p className="text-gray-600 mb-4">You need to log in to view this content.</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-700 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105"
            >
              Go to Login
            </button>
            <button
              onClick={() => setShowLoginWarning(false)}
              className="ml-4 bg-zinc-700 px-4 py-2 rounded text-white cursor-pointer  hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </div>
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
