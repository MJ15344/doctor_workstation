<template>
    <div class="emergency-doctor-station">
        <!-- 顶部导航栏 -->
        <div class="top-bar">
            <div class="title-section">
                <h1 class="title">门急诊医生站</h1>
                <p class="subtitle">患者信息管理与诊断记录</p>
            </div>
            <button @click="goBack" class="back-button">
                <span class="back-icon">←</span>
                <span>返回上级</span>
            </button>
        </div>

        <div class="content-wrapper">
            <!-- 患者信息管理 -->
            <div :class="['patient-section', { 'half-width': showDiagnosisSection }]">
                <div class="section-header">
                    <h2 class="section-title">患者信息管理</h2>
                    <button @click="addPatient" class="add-button">
                        <span class="add-icon">+</span>
                        <span>新增患者</span>
                    </button>
                </div>
                <div class="table-container">
                    <table class="patient-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>姓名</th>
                                <th>年龄</th>
                                <th>性别</th>
                                <th>伴随症状</th>
                                <th>门诊诊断</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(patient, index) in patients" :key="index" class="patient-row">
                                <td>
                                    <span v-if="!isEditing[index]">{{ patient.id }}</span>
                                    <input v-else v-model="patient.id" class="edit-input">
                                </td>
                                <td>
                                    <span v-if="!isEditing[index]">{{ patient.name }}</span>
                                    <input v-else v-model="patient.name" class="edit-input">
                                </td>
                                <td>
                                    <span v-if="!isEditing[index]">{{ patient.age }}</span>
                                    <input v-else v-model="patient.age" type="number" class="edit-input">
                                </td>
                                <td>
                                    <span v-if="!isEditing[index]">{{ patient.gender }}</span>
                                    <select v-else v-model="patient.gender" class="edit-select">
                                        <option value="男">男</option>
                                        <option value="女">女</option>
                                    </select>
                                </td>
                                <td>
                                    <a v-if="patient.diagnosis && patient.diagnosis.hpi"
                                       @click="openDiagnosisModal(index, 'hpi')"
                                       class="view-link">
                                        查看症状
                                    </a>
                                    <span v-else class="empty-text">-</span>
                                </td>
                                <td>
                                    <a v-if="patient.diagnosis && patient.diagnosis.diagnosisResult"
                                       @click="openDiagnosisModal(index, 'diagnosisResult')"
                                       class="view-link">
                                        查看诊断
                                    </a>
                                    <span v-else class="empty-text">-</span>
                                </td>
                                <td class="action-buttons">
                                    <button @click="toggleEdit(index)"
                                            :class="['action-button', isEditing[index] ? 'save-button' : 'edit-button']">
                                        {{ isEditing[index] ? '保存' : '编辑' }}
                                    </button>
                                    <button @click="deletePatient(index)" class="action-button delete-button">
                                        删除
                                    </button>
                                    <button @click="openDiagnosisEditModal(index)" class="action-button diagnose-button">
                                        诊断编辑
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 诊断记录编辑 -->
            <div v-show="showDiagnosisSection" class="diagnosis-section">
                <div class="section-header">
                    <h2 class="section-title">诊断记录编辑</h2>
                </div>
                <div class="diagnosis-form">
                    <div class="form-group">
                        <label>伴随症状</label>
                        <textarea v-model="currentDiagnosis.hpi"
                                  class="diagnosis-textarea"
                                  placeholder="请输入患者伴随症状..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>门诊诊断</label>
                        <textarea v-model="currentDiagnosis.diagnosisResult"
                                  class="diagnosis-textarea"
                                  placeholder="请输入诊断结果..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button @click="closeDiagnosisModal" class="cancel-button">取消</button>
                        <button @click="saveDiagnosis" class="save-button">保存更改</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import axios from 'axios';
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const showDiagnosisSection = ref(false);
    const currentPatientId = ref(null);
    const patients = ref([]);
    const isEditing = ref([]);
    const currentDiagnosis = ref({ hpi: '', diagnosisResult: '' });

    const goBack = () => {
        router.push('/DoctorWorkstation');
    };

    const addPatient = () => {
        const lastId = patients.value.length > 0 ? parseInt(patients.value[patients.value.length - 1].id) : 0;
        const newId = lastId + 1;
        patients.value.push({
            id: newId,
            name: '',
            age: '',
            gender: '男',
            diagnosis: { hpi: '', diagnosisResult: '' }
        });
        isEditing.value.push(false);
    };

    const deletePatient = (index) => {
        const deletedId = patients.value[index].id;
        if (deletedId === currentPatientId.value) {
            currentPatientId.value = null;
        }
        patients.value.splice(index, 1);
        isEditing.value.splice(index, 1);
    };

    const toggleEdit = async (index) => {
        const wasEditing = isEditing.value[index];
        isEditing.value[index] = !wasEditing;

        if (wasEditing) {
            const patient = patients.value[index];
            const dataToSend = {
                id: patient.id,
                name: patient.name,
                age: patient.age,
                gender: patient.gender,
                hpi: patient.diagnosis.hpi || '',
                diagnosisResult: patient.diagnosis.diagnosisResult || ''
            };

            try {
                const response = await axios.post('http://localhost:3000/api/savePatient', dataToSend);
                if (!response.data.success) {
                    alert('保存失败: ' + (response.data.message || '未知错误'));
                    isEditing.value[index] = true;
                }
            } catch (error) {
                console.error('保存请求失败:', error);
                alert('网络错误，请检查控制台');
                isEditing.value[index] = true;
            }
        }
    };

    const openDiagnosisEditModal = (index) => {
        if (index < 0 || index >= patients.value.length) return;
        const patient = patients.value[index];
        currentPatientId.value = patient.id;
        currentDiagnosis.value = {
            hpi: patient.diagnosis?.hpi || '',
            diagnosisResult: patient.diagnosis?.diagnosisResult || ''
        };
        showDiagnosisSection.value = true;
    };

    const openDiagnosisModal = (index, field) => {
        const patient = patients.value[index];
        currentPatientId.value = patient.id;
        currentDiagnosis.value = { ...patient.diagnosis };
        showDiagnosisSection.value = true;
    };

    const saveDiagnosis = async () => {
        if (!currentPatientId.value) return;

        try {
            await axios.post('http://localhost:3000/api/updateDiagnosis', {
                id: currentPatientId.value,
                hpi: currentDiagnosis.value.hpi,
                diagnosisResult: currentDiagnosis.value.diagnosisResult
            });

            const index = patients.value.findIndex(p => p.id === currentPatientId.value);
            if (index !== -1) {
                patients.value[index] = {
                    ...patients.value[index],
                    diagnosis: {
                        hpi: currentDiagnosis.value.hpi,
                        diagnosisResult: currentDiagnosis.value.diagnosisResult
                    }
                };
            }
            showDiagnosisSection.value = false;
        } catch (error) {
            console.error('更新失败:', error);
            alert('更新失败: ' + (error.response?.data?.message || '未知错误'));
        }
    };

    const closeDiagnosisModal = () => {
        showDiagnosisSection.value = false;
    };

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/getPatients');
            if (response.data.success) {
                patients.value = response.data.data.map(patient => ({
                    ...patient,
                    diagnosis: {
                        hpi: patient.hpi || '',
                        diagnosisResult: patient.diagnosisResult || ''
                    }
                }));
                isEditing.value = patients.value.map(() => false);
            }
        } catch (error) {
            console.error('获取患者数据出错:', error);
        }
    });
</script>

<style scoped>
.emergency-doctor-station {
    min-height: 100vh;
    background-color: #f8f9fa;
    padding: 24px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.title-section {
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.subtitle {
    font-size: 14px;
    color: #666;
    margin: 4px 0 0;
}

.back-button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #f0f2f5;
    color: #666;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-button:hover {
    background-color: #e6e6e6;
    color: #333;
}

.back-icon {
    margin-right: 8px;
    font-size: 16px;
}

.content-wrapper {
    display: flex;
    gap: 24px;
}

.patient-section {
    flex: 1;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.half-width {
    width: 50%;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.add-button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-button:hover {
    background-color: #40a9ff;
}

.add-icon {
    margin-right: 8px;
    font-size: 16px;
}

.table-container {
    overflow-x: auto;
    padding: 0 24px;
}

.patient-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
}

.patient-table th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #666;
    background-color: #fafafa;
    border-bottom: 1px solid #f0f0f0;
}

.patient-table td {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
}

.patient-row:hover {
    background-color: #fafafa;
}

.edit-input, .edit-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    transition: all 0.3s;
}

.edit-input:focus, .edit-select:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.view-link {
    color: #1890ff;
    text-decoration: none;
    cursor: pointer;
}

.view-link:hover {
    text-decoration: underline;
}

.empty-text {
    color: #bfbfbf;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.action-button {
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.edit-button {
    background-color: #e6f7ff;
    color: #1890ff;
}

.edit-button:hover {
    background-color: #bae7ff;
}

.save-button {
    background-color: #f6ffed;
    color: #52c41a;
}

.save-button:hover {
    background-color: #d9f7be;
}

.delete-button {
    background-color: #fff1f0;
    color: #ff4d4f;
}

.delete-button:hover {
    background-color: #ffccc7;
}

.diagnose-button {
    background-color: #f9f0ff;
    color: #722ed1;
}

.diagnose-button:hover {
    background-color: #efdbff;
}

.diagnosis-section {
    width: 50%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.diagnosis-form {
    padding: 24px;
}

.form-group {
    margin-bottom: 24px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #666;
    font-weight: 500;
}

.diagnosis-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    resize: vertical;
    min-height: 120px;
    transition: all 0.3s;
}

.diagnosis-textarea:focus {
    border-color: #40a9ff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.cancel-button {
    padding: 8px 16px;
    background-color: #f5f5f5;
    color: #666;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cancel-button:hover {
    background-color: #e6e6e6;
}

.save-button {
    padding: 8px 16px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.save-button:hover {
    background-color: #40a9ff;
}
</style>
