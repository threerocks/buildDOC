/**
 * 路由
 *
 * 每条路由规则由一个数组代表，第一个参数是HTTP方法，第二个是路径，第三个是模型，第四个是方法名，第五个为其它参数（可选）
 * 具体的执行在run.js里完成
 */

'use strict';

// 引用
let run = require('./run');
let fs = require('fs');
let html = fs.readFileSync(`${__dirname}/../../../apollon-frontend/public/index.html`);

// 路由
let routes = [
  ['get', '/user', models.user, 'getUser'],
  ['post', '/user/sms', models.user, 'postUserSMS'],
  ['put', '/user/password', models.user, 'putPassword'],

  ['get', '/admins', models.admin, 'getAdmins'],
  ['post', '/admin', models.admin, 'postAdmin'],
  ['delete', '/admin', models.admin, 'deleteAdmin'],

  ['get', '/course', models.course, 'getCourse'],
  ['post', '/course', models.course, 'postCourse'],
  ['put', '/course', models.course, 'putCourse'],
  ['get', '/courses', models.course, 'getCourses'],
  ['put', '/course/status', models.course, 'putCourseStatus'],
  ['get', '/course/sections', models.course, 'getCourseSections'],
  ['delete', '/course', models.course, 'deleteCourse'],

  ['get', '/document', models.document, 'getDocument'],
  ['get', '/documents', models.document, 'getDocuments'],
  ['post', '/document', models.document, 'postDocument', {multipart: true}],
  ['put', '/document', models.document, 'putDocument', {multipart: true}],
  ['put', '/document/status', models.document, 'putDocumentStatus'],
  ['put', '/document/distribution', models.document, 'putDocumentDistribution'],
  ['delete', '/document', models.document, 'deleteDocument'],

  ['get', '/products', models.product, 'getProducts'],
  ['post', '/product', models.product, 'postProduct'],
  ['put', '/product', models.product, 'putProduct'],
  ['put', '/product/status', models.product, 'putProductStatus'],
  ['delete', '/product', models.product, 'deleteProduct'],

  ['get', '/organization', models.organization, 'getOrganization'],
  ['get', '/organizations', models.organization, 'getOrganizations'],
  ['post', '/organization', models.organization, 'postOrganization', {multipart: true}],
  ['put', '/organization', models.organization, 'putOrganization', {multipart: true}],
  ['put', '/organization/status', models.organization, 'putOrganizationStatus'],
  ['put', '/organization/heartbeat', models.organization, 'putOrganizationHeartbeat'],
  ['delete', '/organization/heartbeat', models.organization, 'deleteOrganizationHeartbeat'],

  ['get', '/role', models.role, 'getRole'],
  ['get', '/roles', models.role, 'getRoles'],
  ['post', '/role', models.role, 'postRole'],
  ['put', '/role', models.role, 'putRole'],
  ['put', '/role/status', models.role, 'putRoleStatus'],
  ['delete', '/role', models.role, 'deleteRole'],

  ['get', '/organization/structure', models.organization, 'getStructure'],
  ['get', '/organization/campuses', models.organization, 'getCampuses'],
  ['post', '/organization/department', models.organizationDepartment, 'postDepartment'],
  ['put', '/organization/department', models.organizationDepartment, 'putDepartment'],
  ['delete', '/organization/department', models.organizationDepartment, 'deleteDepartment'],

  ['get', '/organization/staff', models.organizationStaff, 'getStaff'],
  ['get', '/organization/staffs', models.organizationStaff, 'getStaffs'],
  ['post', '/organization/staff', models.organizationStaff, 'postStaff', {multipart: true}],
  ['put', '/organization/staff', models.organizationStaff, 'putStaff', {multipart: true}],
  ['put', '/organization/staff/status', models.organizationStaff, 'putStaffStatus'],
  ['put', '/organization/staff/parent', models.organizationStaff, 'putStaffParent'],

  ['get', '/organization/prices', models.organizationPrice, 'getPrices'],
  ['put', '/organization/price', models.organizationPrice, 'putPrice'],
  ['put', '/organization/price/status', models.organizationPrice, 'putPriceStatus'],

  ['get', '/student', models.student, 'getStudent'],
  ['get', '/students', models.student, 'getStudents'],
  ['post', '/student', models.student, 'postStudent', {multipart: true}],
  // ['post', '/student/v2', models.student, 'newPostStudent'],
  ['put', '/student', models.student, 'putStudent', {multipart: true}],
  ['put', '/student/:id', models.student, 'newPutStudent'],
  ['put', '/student/status', models.student, 'putStudentStatus'],
  ['get', '/student/token', models.user, 'getStudentToken'],
  ['get', '/student/:id/study-info', models.student, 'getStudyInfo'],
  ['delete', '/student', models.student, 'deleteStudent'],

  ['get', '/teacher', models.teacher, 'getTeacher'],
  ['get', '/teachers', models.teacher, 'getTeachers'],
  ['post', '/teacher/:id?', models.teacher, 'postTeacher'],
  ['put', '/teacher', models.teacher, 'putTeacher'],
  // ['put', '/teacher/status', models.teacher, 'putTeacherStatus'],
  // ['delete', '/teacher', models.teacher, 'deleteTeacher'],

  ['get', '/teachings', models.teaching, 'getTeachings'],
  ['post', '/teaching', models.teaching, 'postTeaching'],
  ['put', '/teaching/status', models.teaching, 'putTeachingStatus'],

  //TODO get /absences api 已做修改，老的接口请求可能不可用，需要修复
  ['get', '/absences', models.absence, 'getAbsences'],
  ['post', '/absence', models.absence, 'postAbsence'],
  ['put', '/absence/status', models.absence, 'putAbsenceStatus'],
  ['put', '/absence/:id', models.absence, 'putAbsenceStatus'],
  ['delete', '/absence/:id', models.absence, 'deleteAbsence'],

  ['get', '/question', models.question, 'getQuestion'],
  ['get', '/questions', models.question, 'getQuestions'],
  ['get', '/question/answers', models.question, 'getQuestionAnswers'],
  ['post', '/question/answer', models.question, 'postQuestionAnswer'],
  ['post', '/question', models.question, 'postQuestion'],

  ['get', '/note', models.note, 'getNote'],
  ['get', '/notes', models.note, 'getNotes'],
  ['post', '/note', models.note, 'postNote'],
  ['put', '/note', models.note, 'putNote'],
  ['delete', '/note', models.note, 'deleteNote'],

  ['get', '/checklist', models.checklist, 'getChecklist'],
  ['get', '/checklists', models.checklist, 'getChecklists'],
  ['get', '/checklist/phases', models.checklist, 'getChecklistPhases'],
  ['get', '/checklist/phase/tasks', models.checklist, 'getChecklistPhaseTasks'],
  ['post', '/checklist', models.checklist, 'postChecklist'],
  ['put', '/checklist', models.checklist, 'putChecklist'],
  ['put', '/checklist/status', models.checklist, 'putChecklistStatus'],
  ['delete', '/checklist', models.checklist, 'deleteChecklist'],

  ['get', '/plan', models.plan, 'getPlan'],
  ['get', '/plans', models.plan, 'getPlans'],
  ['get', '/plan/phases', models.plan, 'getPlanPhases'],
  ['get', '/plan/phase/tasks', models.plan, 'getPlanPhaseTasks'],
  ['get', '/plan/periods', models.plan, 'getPlanPeriods'],
  ['get', '/plan/history', models.plan, 'getPlanHistory'],
  ['get', '/plan/task', models.plan, 'getPlanTask'],
  ['get', '/plan/schedule/feedbacks', models.plan, 'getPlanScheduleFeedbacks'],
  ['post', '/plan', models.plan, 'postPlan'],
  ['post', '/plan/auto', models.plan, 'postPlanAuto'],
  ['post', '/plan/history', models.planHistory, 'postHistory'],
  ['post', '/plan/schedule/feedback', models.plan, 'postPlanScheduleFeedback'],
  ['put', '/plan', models.plan, 'putPlan'],
  ['put', '/plan/task/complete', models.studentTask, 'putTaskComplete'],
  // ['put', '/plan/task/pigai', models.plan, 'putPlanTaskPigai'],
  ['get', '/plan/task/pigai/availability', models.plan, 'getPlanTaskPigaiAvailability'],
  ['get', '/plan/stat', models.plan, 'getPlanStat'],
  ['delete', '/plan', models.plan, 'deletePlan'],
  ['get', '/plan/schedule/xls', models.plan, 'getPlanScheduleXLS', {raw: true}],
  ['get', '/plan/task/xls', models.plan, 'getPlanTaskXLS', {raw: true}],
  ['get', '/plan/pigaied/tasks', models.plan, 'getPigaiedTasks'],

  ['post', '/phase', models.phase, 'postPhase'],
  ['put', '/phase', models.phase, 'putPhase'],
  ['delete', '/phase', models.phase, 'deletePhase'],

  ['post', '/task', models.task, 'postTask'],
  ['put', '/task', models.task, 'putTask'],
  ['delete', '/task', models.task, 'deleteTask'],
  ['get', '/task/count', models.task, 'getTaskCount'],

  ['post', '/schedule', models.schedule, 'postSchedule'],
  ['put', '/schedule', models.schedule, 'putSchedule'],
  ['put', '/schedule/order', models.schedule, 'putScheduleOrder'],
  ['delete', '/schedule', models.schedule, 'deleteSchedule'],

  ['get', '/contract', models.contract, 'getContract'],
  ['get', '/contracts', models.contract, 'getContracts'],
  ['get', '/contract/teachers', models.contractTeacher, 'getTeachers'],
  ['get', '/contract/postponements', models.contractPostponement, 'getPostponements'],
  ['post', '/contract', models.contract, 'postContract'],
  ['post', '/contract/teacher', models.contractTeacher, 'postTeacher'],
  ['put', '/contract/status', models.contract, 'putContractStatus'],
  ['put', '/contract/start', models.contract, 'putContractStart'],
  ['put', '/contract/teacher/status', models.contractTeacher, 'putTeacherStatus'],
  ['post', '/contract/postponement', models.contractPostponement, 'postPostponement'],
  ['delete', '/contract', models.contract, 'deleteContract'],

  ['get', '/configs', models.config, 'getConfigs'],

  ['get', '/config/lovs', models.configLov, 'getLovs'],
  ['post', '/config/lov', models.configLov, 'postLov'],
  ['put', '/config/lov', models.configLov, 'putLov'],
  ['get', '/config/fields', models.configLov, 'getFields'],

  ['get', '/config/examinations', models.configExamination, 'getExaminations'],
  ['post', '/config/examination', models.configExamination, 'postExamination'],
  ['put', '/config/examination', models.configExamination, 'putExamination'],
  ['put', '/config/examination/status', models.configExamination, 'putExaminationStatus'],

  ['get', '/config/subjects', models.configExaminationSubject, 'getSubjects'],
  ['post', '/config/subject', models.configExaminationSubject, 'postSubject'],
  ['put', '/config/subject', models.configExaminationSubject, 'putSubject'],
  ['put', '/config/subject/status', models.configExaminationSubject, 'putSubjectStatus'],

  ['get', '/config/tags', models.configTag, 'getTags'],
  ['post', '/config/tag', models.configTag, 'postTag'],
  ['put', '/config/tag', models.configTag, 'putTag'],

  ['get', '/config/holidays', models.configHoliday, 'getHolidays'],
  ['post', '/config/holiday', models.configHoliday, 'postHoliday'],
  ['put', '/config/holiday', models.configHoliday, 'putHoliday'],

  ['get', '/examinations', models.examConf, 'getExaminations'],
  ['get', '/subjects', models.examConf, 'getSubjects'],

  ['get', '/crm/branch/companies', models.crm, 'getBranchCompanies'],

  // 评论功能
  ['post', '/comment', models.comment, 'postComment'],
  ['get', '/comments', models.comment, 'getComments'],
  ['get', '/comment/teachers', models.comment, 'getTeachers'],

  // 教室管理
  ['post', '/classroom/:id?', models.classroom, 'postClassroom'],
  ['get', '/classrooms', models.classroom, 'getClassrooms'],
  ['get', '/classroom', models.classroom, 'getClassroom'],
  ['put', '/classroom', models.classroom, 'putClassroom'],
  ['get', '/classrooms/enable-rooms', models.classroom, 'getEnableClassrooms'],

  // 排课/调课申请
  ['get', '/course-request', models.courseRequest, 'getCourseRequest'],
  ['post', '/course-request', models.courseRequest, 'postCourseRequest'],
  ['get', '/course-requests', models.courseRequest, 'getCourseRequests'],
  ['put', '/course-request', models.courseRequest, 'putCourseRequest'],
  ['get', '/course-request/enable-time', models.courseRequest, 'getEnableTime'],
  ['get', '/course-request/courses', models.courseRequest, 'getChangeCourses'],

  // 面授管理
  ['post', '/vip-course', models.vipCourse, 'postVipCourse'],
  ['delete', '/vip-courses', models.vipCourse, 'deleteVipCourses'],
  ['put', '/vip-courses', models.vipCourse, 'putVipCourses'],
  ['get', '/vip-courses', models.vipCourse, 'getVipCourses'],
  ['get', '/vip-course/duration', models.vipCourse, 'getCourseDuration'],

  // 班课管理
  ['post', '/group-course', models.groupCourse, 'postGroupCourse'],
  ['put', '/group-course', models.groupCourse, 'putGroupCourse'],
  ['get', '/group-courses', models.groupCourse, 'getGroupCourses'],
  ['delete', '/group-course', models.groupCourse, 'deleteGroupCourse'],

  // 学生任务
  ['post', '/student-task', models.studentTask, 'postStudentTask'],
  ['get', '/student-tasks', models.studentTask, 'getStudentTasks'],
  ['put', '/student-task/pigai', models.studentTask, 'putTaskPigai'],
  ['put', '/student-task/:id', models.studentTask, 'putStudentTask'],
  ['delete', '/student-task/:id', models.studentTask, 'deleteStudentTask'],
  ['post', '/student-task/:id/feedback', models.studentTask, 'postFeedback'],
  ['get', '/student-task/xls', models.studentTask, 'getStudentTaskXLS', {raw: true}],
  ['get', '/student-task/pigai-times', models.studentTask, 'getPigaiTimes'],
  ['get', '/student/task/pigaied/tasks', models.studentTask, 'getPigaiedTasks'],

  ['get', '/crm/branch/companies', models.crm, 'getBranchCompanies'],

  ['get', '/contract-transfer/students', models.contractTransfer, 'getStudents'],
  ['get', '/contract-transfers', models.contractTransfer, 'getContractTransfers'],
  ['get', '/contract-transfer/:id/applied-courses', models.contractTransfer, 'getAppliedCourses'],
  ['get', '/contract-transfer/:id', models.contractTransfer, 'getContractTransfer'],
  ['post', '/contract-transfer/:id?', models.contractTransfer, 'postContractTransfer'],
  ['post', '/interface/contract-transfer', models.contractTransfer, 'postContractTransfer', {multipart: true}],
  ['get', '/interface/contract-transfers', models.contractTransfer, 'getInterfaceContractTransfer'],
  ['get', '/interface/contract-transfer', models.contractTransfer, 'getContractTransfer'],
  ['put', '/contract-transfer/:id', models.contractTransfer, 'putContractTransfer'],
  ['get', '/contract-transfers/subjects/', models.contractTransfer, 'getSubjects'],

  //获取教师课表或者学生课表信息
  ['get', '/course-schedule', models.courseSchedule, 'getCourseSchedule'],

  //获取教师饱和度
  ['get', '/teacher-schedule-overview', models.scheduleOverview, 'getTeacherScheduleOverview'],

  //获取教室饱和度
  ['get', '/classroom-schedule-overview', models.scheduleOverview, 'getClassroomScheduleOverview'],

  //根据机构id获取改机构的教室使用情况统计
  ['get', '/classroom-usage', models.scheduleOverview, 'getClassroomUsage'],

  ['get', '/live-classrooms', models.liveClassroom, 'getLiveClassrooms'],
  ['post', '/live-classroom', models.liveClassroom, 'postLiveClassroom'],
  ['put', '/live-classroom/:id', models.liveClassroom, 'putLiveClassroom'],

  // 学生学习任务历史记录
  ['post', '/task/history', models.taskHistory, 'postHistory'],
  ['get', '/task/histories', models.taskHistory, 'getHistories'],
];

// 设置
module.exports = function(app) {
  routes.map(function(route) {
    app[route[0]](`/api${route[1]}`, run(route[2][route[3]].bind(route[2]), route[4]));
  });

  // 静态分发
  app.get('*', function(req, res) {
    res.end(html);
  });
};
