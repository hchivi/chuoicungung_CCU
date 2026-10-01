// ============================================================================
// ADMIN TASKS, OVERDUE CENTER & MY WORK ("VIỆC CỦA TÔI")
// PAGE 19: BÀN ĐIỀU PHỐI NỘI BỘ (/admin/tasks)
// Chuẩn hóa theo spec 19.txt (Section 6, 9, 10, 15, 16) - CHUOICUNGUNG.COM
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock, CheckCircle2, AlertTriangle, Plus, Search, Filter,
  Calendar, UserCheck, ShieldAlert, ArrowRight, RefreshCw,
  Check, X, FileText, Layers, Briefcase, Zap, AlertCircle
} from 'lucide-react';
import {
  getAllUnifiedTasks,
  saveAllUnifiedTasks,
  createUnifiedTask,
  updateUnifiedTaskStatus,
  TASK_STATUSES,
  getActiveAdminRole,
  logAdminMutationAudit
} from '../../data/adminUnifiedCoordinationData';

export default function AdminTasksAndOverdueCenter() {
  const [tasks, setTasks] = useState([]);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'OVERDUE' | 'TODAY' | 'MY_WORK' | 'COMPLETED'
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Form state for creating task
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskEntity, setNewTaskEntity] = useState('REQUIREMENT');
  const [newTaskEntityId, setNewTaskEntityId] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('NORMAL');

  const activeRole = getActiveAdminRole();
  const nowIso = new Date().toISOString();
  const todayStr = nowIso.slice(0, 10);

  const loadData = () => {
    setTasks(getAllUnifiedTasks());
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrichedTasks = useMemo(() => {
    return tasks.map(t => {
      const isOverdue = t.status !== 'COMPLETED' && t.status !== 'CANCELLED' && t.dueAt && t.dueAt < nowIso;
      const isToday = t.dueAt && t.dueAt.slice(0, 10) === todayStr;
      return {
        ...t,
        isOverdue,
        isToday
      };
    });
  }, [tasks, nowIso, todayStr]);

  const filteredTasks = useMemo(() => {
    return enrichedTasks.filter(t => {
      if (filterMode === 'OVERDUE' && !t.isOverdue) return false;
      if (filterMode === 'TODAY' && !t.isToday) return false;
      if (filterMode === 'COMPLETED' && t.status !== 'COMPLETED') return false;
      if (filterMode === 'MY_WORK' && t.status === 'COMPLETED') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchOwner = (t.ownerName || '').toLowerCase().includes(q);
        const matchEntity = (t.entityId || '').toLowerCase().includes(q);
        if (!matchTitle && !matchOwner && !matchEntity) return false;
      }
      return true;
    });
  }, [enrichedTasks, filterMode, searchQuery]);

  const overdueCount = enrichedTasks.filter(t => t.isOverdue).length;
  const todayCount = enrichedTasks.filter(t => t.isToday && t.status !== 'COMPLETED').length;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    createUnifiedTask({
      title: newTaskTitle,
      description: newTaskDesc,
      entityType: newTaskEntity,
      entityId: newTaskEntityId || `REF-${Date.now().toString().slice(-4)}`,
      dueAt: newTaskDue ? new Date(newTaskDue).toISOString() : new Date(Date.now() + 86400000 * 2).toISOString(),
      priority: newTaskPriority,
      createdBy: activeRole.name
    });

    setIsCreateModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskEntityId('');
    setNewTaskDue('');
    loadData();
    setActionSuccessMsg('Đã tạo công việc mới thành công!');
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  const handleToggleComplete = (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'OPEN' : 'COMPLETED';
    updateUnifiedTaskStatus(taskId, nextStatus, activeRole.name);
    loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>TRUNG TÂM CÔNG VIỆC & XỬ LÝ QUÁ HẠN (OVERDUE CENTER)</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            Công Việc, Quá Hạn & Việc Của Tôi (My Work)
          </h2>
          <p className="text-xs text-slate-500">
            Mọi work item active đều có người phụ trách (Owner) và việc tiếp theo có định ngày (Next Action Due).
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-heading uppercase transition flex items-center space-x-1.5 shadow-xs cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo công việc mới</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter Tabs Bar (Section 9 & 10) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-1 overflow-x-auto text-xs font-heading font-bold">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterMode === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả ({enrichedTasks.length})
          </button>

          <button
            onClick={() => setFilterMode('OVERDUE')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center space-x-1 ${
              filterMode === 'OVERDUE'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Quá hạn ({overdueCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('TODAY')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterMode === 'TODAY' ? 'bg-amber-500 text-slate-950 font-black' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            Hôm nay ({todayCount})
          </button>

          <button
            onClick={() => setFilterMode('MY_WORK')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterMode === 'MY_WORK' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Việc của tôi
          </button>

          <button
            onClick={() => setFilterMode('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
              filterMode === 'COMPLETED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Đã xong
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, người phụ trách..."
            className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none w-56"
          />
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic text-xs font-mono space-y-2">
            <div>Không có công việc nào trong danh mục này.</div>
            {filterMode === 'OVERDUE' && <div className="text-emerald-600 font-bold">🎉 Tuyệt vời! Không có việc nào bị quá hạn.</div>}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition ${
                task.isOverdue ? 'bg-rose-50/30' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={task.status === 'COMPLETED'}
                  onChange={() => handleToggleComplete(task.id, task.status)}
                  className="w-4 h-4 text-emerald-600 rounded mt-1 cursor-pointer"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {task.entityType}: {task.entityId}
                    </span>
                    {task.isOverdue && (
                      <span className="text-[9.5px] font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded">
                        QUÁ HẠN
                      </span>
                    )}
                    <span className={`text-[10px] font-mono px-2 py-0.2 rounded ${
                      task.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold text-slate-900 ${
                    task.status === 'COMPLETED' ? 'line-through text-slate-400' : ''
                  }`}>
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-[11px] text-slate-600">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto shrink-0 text-xs font-mono">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Phụ trách:</span>
                  <span className="font-bold text-slate-800">{task.ownerName?.split(' ')[0]}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Hạn chót:</span>
                  <span className={`font-bold ${task.isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                    {task.dueAt ? task.dueAt.slice(0, 10) : 'Chưa định ngày'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600">Unified Task Engine</span>
                <h3 className="text-base font-black text-slate-900 font-heading">Tạo Công Việc Điều Phối Mới</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Tiêu đề công việc *:</label>
                <input
                  required
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="VD: Kiểm tra mẫu vải, liên hệ báo giá..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Gắn với đối tượng:</label>
                  <select
                    value={newTaskEntity}
                    onChange={(e) => setNewTaskEntity(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="REQUIREMENT">Nhu cầu (Requirement)</option>
                    <option value="SUPPLIER_MATCH">Ghép nối NCC (Connection)</option>
                    <option value="SERVICE_REQUEST">Dịch vụ (Service Request)</option>
                    <option value="FOUNDING_PARTNERSHIP">Founding Partner</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Mã định danh (ID/Code):</label>
                  <input
                    type="text"
                    value={newTaskEntityId}
                    onChange={(e) => setNewTaskEntityId(e.target.value)}
                    placeholder="VD: NC-2026-00125"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Hạn chót hoàn thành (Due Date):</label>
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Mức độ ưu tiên:</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Ưu tiên cao</option>
                    <option value="CRITICAL">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Chi tiết hướng dẫn:</label>
                <textarea
                  rows="3"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Ghi chú chi tiết yêu cầu công việc..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-heading uppercase cursor-pointer"
                >
                  Tạo công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
