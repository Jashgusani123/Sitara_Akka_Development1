import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetSubdata } from '../../APIs/GetAPIs';
import type { RootState } from '../../Redux/Store';
import { SubDataUploadDialog } from '../CreateResourcesSteps/SubDataUploadDialog';
import ResourceSubdata from './ResourceSubdata';
import { ResourceDataEntryDialog } from '../CreateResourcesSteps/ResourceDataEntryDialog';

interface Props {
  expandedEntryId: string,
  setExpandedEntryId: (id: string | null) => void,
  setExpandedSubId: (id: string | null) => void,
  id: string,
  isAdmin: boolean,
  type: string,
  parentId: string;
  expandedSubId: string | null
  handleDelete: ({ id, at, key }: { id: string, at: string, key?: string }) => void
}

const ResourceEntry = ({
  expandedEntryId,
  setExpandedEntryId,
  setExpandedSubId,
  id,
  isAdmin,
  type,
  handleDelete,
  parentId,
  expandedSubId
}: Props) => {

  const [showForm, setShowForm] = useState(false);
  const [showFormForEdit, setshowFormForEdit] = useState(false);
  const [currentSubId, setCurrentSubId] = useState<string | null>(null);
  const subDataMap = useSelector((state: RootState) => state.subData.subDataMap);
  const dispatch = useDispatch();

  const handleSubdataFetch = (entryId: string) => {
    const isExpanded = expandedEntryId === entryId;
    setExpandedEntryId(isExpanded ? null : entryId);
    setExpandedSubId(null);

    if (!isExpanded && !subDataMap[entryId]) {
      GetSubdata({ resourceDataEntryId: entryId, dispatch });
    }
  };

  const handleAddEntry = (resourceDataEntryId: string) => {
    setCurrentSubId(resourceDataEntryId);
    setShowForm(true);
  }

  const currentSubData = subDataMap[id] || [];

  return (
    <>
      <div className="flex justify-between items-center ">
        <span className="text-gray-700 font-medium cursor-pointer" onClick={() => handleSubdataFetch(id)}>
          {type}
        </span>
        {isAdmin && (
          <div className="flex gap-2">
            <button className="bg-green-300 rounded-xl px-3 py-1 hover:bg-green-400 cursor-pointer text-sm transition" onClick={() => setshowFormForEdit(true)}>
              Edit
            </button>
            <button
              className="bg-red-300 rounded-xl px-3 py-1 hover:bg-red-400 cursor-pointer text-sm transition"
              onClick={() => {
                if (parentId) {
                  handleDelete({ id, at: "resource-data-entries", key: parentId })
                }
              }}
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
        {expandedEntryId === id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 space-y-2"
          >
            {currentSubData.length !== 0 ? (
              currentSubData.map((sub) => {
                const isArray = sub.datatype === "array";
                const isSubExpanded = expandedSubId === sub._id;

                return (
                  <div
                    key={sub._id}
                    className="flex flex-col gap-1 bg-white px-3 py-2 rounded-md border border-gray-200"
                  >
                    <ResourceSubdata
                      isArray={isArray}
                      isSubExpanded={isSubExpanded}
                      type={sub.datatype}
                      link={sub.link}
                      setExpandedSubId={setExpandedSubId}
                      id={sub._id}
                      parentId={id}
                      isAdmin={isAdmin}
                      subject={sub.name}
                      handleDelete={handleDelete}
                    />
                  </div>
                );
              })
            ) : (
              <p className='text-zinc-500 text-sm '>Not Added Yet.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && currentSubId && (
        <SubDataUploadDialog
          resourceDataEntryId={currentSubId}
          onClose={() => setShowForm(false)}
        />
      )}

      {showFormForEdit && (
        <ResourceDataEntryDialog
          entryId={id}
          handleEditRequest={true}
          resourceId={parentId}
          onClose={() => setshowFormForEdit(false)}
        />
      )}
    </>
  );
};

export default ResourceEntry;
