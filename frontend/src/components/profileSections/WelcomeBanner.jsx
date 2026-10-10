import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import {Plus} from 'lucide-react'
import CreateEntryModal from './CreateEntryModal'

const WelcomeBanner = () => {
    const {user}  = useAuth
  const [showCreateModal, setShowCreateModal] = useState(false);
  return (
    <div className='mb-4'>
        <div className="bg-[#111511] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-emerald-400">✦</span>
            </div>
            <div>
                <p className="text-xs text-gray-500">
                Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}
                </p>
                <h1 className="text-lg font-semibold">
                Discover inspiring journals from writers worldwide
                </h1>
            </div>
          </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium px-5 py-2.5 rounded-full shrink-0">
              <Plus size={15} />
              Write an entry
            </button>
         </div>
      {showCreateModal && (
              <CreateEntryModal onClose={() => setShowCreateModal(false)} />
            )}

    </div>
  )
}

export default WelcomeBanner