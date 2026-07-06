import Feedback from '../models/Feedback';

export const getAnalyticsService = async () => {
  const [summary, recentFeedback, statusCounts] = await Promise.all([
    Feedback.aggregate([
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $project: {
          _id: 0,
          totalFeedback: 1,
          averageRating: { $round: ['$averageRating', 2] }
        }
      }
    ]),
    Feedback.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          category: 1,
          rating: 1,
          status: 1,
          comment: 1,
          createdAt: 1
        }
      }
    ]),
    Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
  ]);

  const categoryDistribution = await Feedback.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1
      }
    }
  ]);

  const summaryData = summary[0] || { totalFeedback: 0, averageRating: 0 };

  const pendingCount = statusCounts.find((s) => s._id === 'Pending')?.count ?? 0;
  const resolvedCount = statusCounts.find((s) => s._id === 'Resolved')?.count ?? 0;

  return {
    totalFeedback: summaryData.totalFeedback,
    averageRating: summaryData.averageRating,
    pendingCount,
    resolvedCount,
    categoryDistribution,
    recentFeedback
  };
};
