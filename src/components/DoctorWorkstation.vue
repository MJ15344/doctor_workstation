<template>
    <div class="doctor-workstation">
        <!-- 左侧菜单 -->
        <div class="left-menu">
            <div class="menu-header">
                <img src="/images/1.png" alt="图标" class="app-icon" />
                <h3>系统应用</h3>
            </div>
            <ul class="menu-list">
                <li
                    v-for="(menu, index) in menus"
                    :key="index"
                    class="menu-item"
                    :class="{ active: currentMenu === menu.name }"
                    @click="currentMenu = menu.name"
                >
                    <span class="menu-icon">{{ getMenuIcon(menu.name) }}</span>
                    <span class="menu-text">{{ menu.name }}</span>
                </li>
            </ul>
            <button @click="goToLoginPage" class="logout-button">
                <span class="logout-icon">←</span>
                <span>返回登录</span>
            </button>
        </div>

        <!-- 右侧内容区 -->
        <div class="right-content">
            <!-- 通知消息 -->
            <div v-if="shouldShowSection('通知消息')" class="section notice-section">
                <div class="notice-card">
                    <div class="announcement-card">
                        <h3 class="section-title">公告</h3>
                        <ul class="announcement-list">
                            <li v-for="(item, index) in announcements" :key="index" class="announcement-item">
                                <span class="announcement-icon">📢</span>
                                <span>{{ item }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 诊疗工作站 -->
            <div v-if="shouldShowSection('诊疗工作站')" class="section workstation-section">
                <h3 class="section-title">诊疗工作站</h3>
                <div class="workstation-grid">
                    <div class="workstation-item hot" @click="goToEmergencyDoctorStation">
                        <div class="item-icon">
                            <img src="/images/1.png" alt="图标" class="app-icon" />
                            <span class="hot-tag">热门</span>
                        </div>
                        <p class="item-title">门急诊医生站</p>
                    </div>
                    <div class="workstation-item hot">
                        <div class="item-icon">
                            <img src="/images/2.png" alt="图标" class="app-icon" />
                            <span class="hot-tag">热门</span>
                        </div>
                        <p class="item-title">住院医生站</p>
                    </div>
                    <!-- 其他诊疗工作站项 -->
                    <div class="workstation-item" v-for="(item, index) in workstationItems" :key="index">
                        <div class="item-icon">
                            <img :src="item.icon" :alt="item.title" class="app-icon" />
                        </div>
                        <p class="item-title">{{ item.title }}</p>
                    </div>
                </div>
            </div>

            <!-- 病历管理 -->
            <div v-if="shouldShowSection('病历管理')" class="section medical-record-section">
                <h3 class="section-title">病历管理</h3>
                <div class="workstation-grid">
                    <div class="workstation-item" v-for="(item, index) in medicalRecordItems" :key="index">
                        <div class="item-icon">
                            <img :src="item.icon" :alt="item.title" class="app-icon" />
                        </div>
                        <p class="item-title">{{ item.title }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DoctorWorkstation',
    data() {
        return {
            currentMenu: '全部',
            menus: [
                { name: '全部', sections: ['通知消息', '诊疗工作站', '病历管理'] },
                { name: '医生', sections: ['诊疗工作站', '病历管理'] },
                { name: '护士', sections: [] },
                { name: '药事', sections: [] },
                { name: '医技', sections: [] },
                { name: '财务', sections: [] },
                { name: '综合查询', sections: [] },
                { name: '主数据', sections: [] },
                { name: '运维', sections: [] }
            ],
            announcements: [
                '输血培训文档',
                '护士站操作视频',
                '医生站操作视频',
                '医生站操作手册'
            ],
            workstationItems: [
                { icon: '/images/3.png', title: '日间手术门诊工作站' },
                { icon: '/images/4.png', title: '日间手术住院工作站' },
                { icon: '/images/5.png', title: '会诊记录' },
                { icon: '/images/6.png', title: '院内上报' }
            ],
            medicalRecordItems: [
                { icon: '/images/7.png', title: '出院病历编辑' },
                { icon: '/images/8.png', title: '出院病历打印' },
                { icon: '/images/9.png', title: '门诊病历检索' },
                { icon: '/images/10.png', title: '住院病历检索' }
            ]
        };
    },
    methods: {
        getMenuIcon(name) {
            const icons = {
                '全部': '📋',
                '医生': '👨‍⚕️',
                '护士': '👩‍⚕️',
                '药事': '💊',
                '医技': '🔬',
                '财务': '💰',
                '综合查询': '🔍',
                '主数据': '📊',
                '运维': '⚙️'
            };
            return icons[name] || '📌';
        },
        shouldShowSection(section) {
            const currentMenuObj = this.menus.find(menu => menu.name === this.currentMenu);
            return currentMenuObj && currentMenuObj.sections.includes(section);
        },
        goToEmergencyDoctorStation() {
            this.$router.push('/EmergencyDoctorStation');
        },
        goToLoginPage() {
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
.doctor-workstation {
    display: flex;
    height: 100vh;
    background-color: #f8f9fa;
}

.left-menu {
    width: 240px;
    background: #ffffff;
    padding: 24px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.menu-header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
}

.menu-header h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
}

.app-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
}

.menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.menu-item:hover {
    background-color: #f0f2f5;
}

.menu-item.active {
    background-color: #e6f7ff;
    color: #1890ff;
}

.menu-icon {
    margin-right: 12px;
    font-size: 18px;
}

.menu-text {
    font-size: 14px;
}

.right-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
}

.section {
    margin-bottom: 32px;
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
    margin: 0 0 24px;
    color: #333;
    font-size: 20px;
    font-weight: 600;
}

.announcement-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.announcement-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.announcement-item:last-child {
    border-bottom: none;
}

.announcement-icon {
    margin-right: 12px;
    font-size: 16px;
}

.workstation-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
}

.workstation-item {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #f0f0f0;
}

.workstation-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-icon {
    position: relative;
    margin-bottom: 16px;
}

.hot-tag {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4d4f;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
}

.item-title {
    margin: 0;
    color: #333;
    font-size: 14px;
    font-weight: 500;
}

.logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: auto;
    padding: 12px;
    background-color: #f5f5f5;
    color: #666;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
}

.logout-button:hover {
    background-color: #e6e6e6;
    color: #333;
}

.logout-icon {
    margin-right: 8px;
    font-size: 16px;
}
</style>
