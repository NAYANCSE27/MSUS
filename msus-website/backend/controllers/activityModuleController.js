/**
 * Activity Module Controller
 * Handles the 8 organizational activity areas
 */

const ActivityModule = require('../models/ActivityModule');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc    Get all activity modules
 * @route   GET /api/modules
 * @access  Public
 */
exports.getModules = asyncHandler(async (req, res, next) => {
  const modules = await ActivityModule.getAllActive();

  res.status(200).json({
    success: true,
    count: modules.length,
    data: modules
  });
});

/**
 * @desc    Get single activity module by type
 * @route   GET /api/modules/:type
 * @access  Public
 */
exports.getModule = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  const language = req.query.language || 'bn';

  const module = await ActivityModule.findOne({ type, isActive: true })
    .populate('coordinators.user', 'name avatar phone email');

  if (!module) {
    return next(new ErrorResponse(`Activity module not found: ${type}`, 404));
  }

  // Transform response based on language
  const response = {
    ...module.toObject(),
    name: module.name[language] || module.name.bn,
    description: module.description[language] || module.description.bn,
    shortDescription: module.shortDescription?.[language] || module.shortDescription?.bn,
    mission: module.mission?.[language] || module.mission?.bn,
    vision: module.vision?.[language] || module.vision?.bn,
    objectives: module.objectives.map(obj => ({
      ...obj.toObject(),
      text: obj[language] || obj.bn
    })),
    projects: module.projects.map(proj => ({
      ...proj.toObject(),
      title: proj.title[language] || proj.title.bn,
      description: proj.description?.[language] || proj.description?.bn
    })),
    programs: module.programs.map(prog => ({
      ...prog.toObject(),
      name: prog.name[language] || prog.name.bn,
      description: prog.description?.[language] || prog.description?.bn
    })),
    successStories: module.successStories.map(story => ({
      ...story.toObject(),
      title: story.title[language] || story.title.bn,
      content: story.content[language] || story.content.bn,
      impact: story.impact?.[language] || story.impact?.bn
    }))
  };

  res.status(200).json({
    success: true,
    data: response
  });
});

/**
 * @desc    Create/update activity module (Admin)
 * @route   POST /api/modules
 * @access  Private (Admin)
 */
exports.createModule = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.create(req.body);

  res.status(201).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Update activity module
 * @route   PUT /api/modules/:type
 * @access  Private (Admin)
 */
exports.updateModule = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOneAndUpdate(
    { type: req.params.type },
    req.body,
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Add project to module
 * @route   POST /api/modules/:type/projects
 * @access  Private (Admin)
 */
exports.addProject = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOne({ type: req.params.type });

  if (!module) {
    return next(new ErrorResponse(`Module not found: ${req.params.type}`, 404));
  }

  await module.addProject(req.body);

  res.status(201).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/modules/:type/projects/:projectId
 * @access  Private (Admin)
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOne({ type: req.params.type });

  if (!module) {
    return next(new ErrorResponse(`Module not found: ${req.params.type}`, 404));
  }

  const project = module.projects.id(req.params.projectId);

  if (!project) {
    return next(new ErrorResponse('Project not found', 404));
  }

  Object.assign(project, req.body);
  await module.save();

  res.status(200).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/modules/:type/projects/:projectId
 * @access  Private (Admin)
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOne({ type: req.params.type });

  if (!module) {
    return next(new ErrorResponse(`Module not found: ${req.params.type}`, 404));
  }

  module.projects = module.projects.filter(
    p => p._id.toString() !== req.params.projectId
  );

  await module.save();

  res.status(200).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Add success story
 * @route   POST /api/modules/:type/success-stories
 * @access  Private (Admin)
 */
exports.addSuccessStory = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOne({ type: req.params.type });

  if (!module) {
    return next(new ErrorResponse(`Module not found: ${req.params.type}`, 404));
  }

  await module.addSuccessStory(req.body);

  res.status(201).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Update module statistics
 * @route   PUT /api/modules/:type/stats
 * @access  Private (Admin)
 */
exports.updateStats = asyncHandler(async (req, res, next) => {
  const module = await ActivityModule.findOneAndUpdate(
    { type: req.params.type },
    { stats: req.body },
    { new: true, runValidators: true }
  );

  if (!module) {
    return next(new ErrorResponse(`Module not found: ${req.params.type}`, 404));
  }

  res.status(200).json({
    success: true,
    data: module
  });
});

/**
 * @desc    Get module statistics
 * @route   GET /api/modules/stats/overview
 * @access  Public
 */
exports.getStats = asyncHandler(async (req, res, next) => {
  const stats = await ActivityModule.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $project: {
        type: 1,
        name: '$name.bn',
        stats: 1
      }
    }
  ]);

  const totals = stats.reduce((acc, module) => {
    acc.beneficiaries += module.stats.beneficiaries || 0;
    acc.projects += module.stats.completedProjects || 0;
    acc.ongoing += module.stats.ongoingProjects || 0;
    acc.volunteers += module.stats.volunteers || 0;
    acc.funds += module.stats.fundsRaised || 0;
    return acc;
  }, {
    beneficiaries: 0,
    projects: 0,
    ongoing: 0,
    volunteers: 0,
    funds: 0
  });

  res.status(200).json({
    success: true,
    data: {
      byModule: stats,
      totals
    }
  });
});
