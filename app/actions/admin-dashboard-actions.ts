"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "./admin-auth";

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growth: number;
  };
  loans: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    avgAmount: number;
    thisMonth: number;
    growth: number;
  };
  agents: {
    total: number;
    active: number;
    inactive: number;
    topPerformers: Array<{
      id: string;
      name: string;
      applications: number;
      approved: number;
      commission: number;
      status: "pending" | "approved" | "rejected";
    }>;
  };
  commissions: {
    total: number;
    pending: number;
    earned: number;
    rejected: number;
    thisMonth: number;
  };
  contacts: {
    total: number;
    new: number;
    resolved: number;
    thisMonth: number;
  };
  blog: {
    posts: number;
    published: number;
    drafts: number;
    totalViews: number;
    totalLikes: number;
    categories: number;
    topPosts: Array<{
      id: string;
      title: string;
      views: number;
      likes: number;
      status: string;
    }>;
  };
  charts: {
    loansByMonth: Array<{
      month: string;
      applications: number;
      approved: number;
      amount: number;
    }>;
    loansByType: Array<{
      type: string;
      count: number;
      amount: number;
    }>;
    userGrowth: Array<{
      month: string;
      users: number;
      agents: number;
    }>;
    agentPerformance: Array<{
      agent: string;
      applications: number;
      approved: number;
      commission: number;
      status: "pending" | "approved" | "rejected";
    }>;
    commissionTrend: Array<{
      month: string;
      pending: number;
      earned: number;
      rejected: number;
    }>;
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    await requireAdminAuth();
    const supabase = await createClient();

    // Get current date info
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const startOfMonth = new Date(currentYear, currentMonth, 1).toISOString();
    const startOfLastMonth = new Date(
      lastMonthYear,
      lastMonth,
      1
    ).toISOString();
    const endOfLastMonth = new Date(currentYear, currentMonth, 0).toISOString();

    // Users stats
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: activeUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: newUsersThisMonth } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    const { count: newUsersLastMonth } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lt("created_at", endOfLastMonth);

    const userGrowth =
      (newUsersLastMonth || 0) > 0
        ? (((newUsersThisMonth || 0) - (newUsersLastMonth || 0)) /
            (newUsersLastMonth || 0)) *
          100
        : 0;

    // Loans stats
    const { count: totalLoans } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true });

    const { count: pendingLoans } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: approvedLoans } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    const { count: rejectedLoans } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "rejected");

    const { data: loanAmounts } = await supabase
      .from("loan_applications")
      .select("loan_amount");

    const totalAmount =
      loanAmounts?.reduce(
        (sum, loan) => sum + parseFloat(loan.loan_amount || "0"),
        0
      ) || 0;
    const avgAmount =
      (totalLoans || 0) > 0 ? totalAmount / (totalLoans || 0) : 0;

    const { count: loansThisMonth } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    const { count: loansLastMonth } = await supabase
      .from("loan_applications")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lt("created_at", endOfLastMonth);

    const loanGrowth =
      (loansLastMonth || 0) > 0
        ? (((loansThisMonth || 0) - (loansLastMonth || 0)) /
            (loansLastMonth || 0)) *
          100
        : 0;

    // Agents stats
    const { count: totalAgents } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "agent");

    const { count: activeAgents } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "agent")
      .eq("is_active", true);

    // Top performing agents with commission status
    const { data: agentPerformance } = await supabase
      .from("loan_applications")
      .select("agent_id, agent_commission, status")
      .not("agent_id", "is", null);

    const agentStats = agentPerformance?.reduce((acc: any, loan: any) => {
      if (!loan.agent_id) return acc;

      if (!acc[loan.agent_id]) {
        acc[loan.agent_id] = {
          id: loan.agent_id,
          name: loan.agent_id,
          applications: 0,
          approved: 0,
          commission: 0,
          status: "pending" as const,
        };
      }

      acc[loan.agent_id].applications += 1;
      if (loan.status === "approved") {
        acc[loan.agent_id].approved += 1;
        acc[loan.agent_id].commission += parseFloat(
          loan.agent_commission || "0"
        );
        acc[loan.agent_id].status = "approved";
      } else if (loan.status === "rejected") {
        acc[loan.agent_id].status = "rejected";
      }

      return acc;
    }, {});

    const topPerformers = Object.values(agentStats || {})
      .sort((a: any, b: any) => b.applications - a.applications)
      .slice(0, 5) as any[];

    // Commission stats
    const { data: commissionData } = await supabase
      .from("loan_applications")
      .select("agent_commission, status")
      .not("agent_id", "is", null);

    const commissionStats = commissionData?.reduce(
      (acc: any, loan: any) => {
        const commission = parseFloat(loan.agent_commission || "0");
        acc.total += commission;

        if (loan.status === "pending") {
          acc.pending += commission;
        } else if (loan.status === "approved") {
          acc.earned += commission;
        } else if (loan.status === "rejected") {
          acc.rejected += commission;
        }

        return acc;
      },
      { total: 0, pending: 0, earned: 0, rejected: 0 }
    ) || { total: 0, pending: 0, earned: 0, rejected: 0 };

    const { data: thisMonthCommissions } = await supabase
      .from("loan_applications")
      .select("agent_commission")
      .not("agent_id", "is", null)
      .gte("created_at", startOfMonth);

    const commissionThisMonth =
      thisMonthCommissions?.reduce(
        (sum, loan) => sum + parseFloat(loan.agent_commission || "0"),
        0
      ) || 0;

    // Contacts stats
    const { count: totalContacts } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true });

    const { count: newContacts } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "new");

    const { count: resolvedContacts } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "resolved");

    const { count: contactsThisMonth } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    // Blog stats
    const { count: totalPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true });

    const { count: publishedPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "published");

    const { count: draftPosts } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    const { count: totalCategories } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true });

    const { data: blogStats } = await supabase
      .from("posts")
      .select("views, likes")
      .eq("status", "published");

    const totalViews =
      blogStats?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
    const totalLikes =
      blogStats?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

    // Top performing blog posts
    const { data: topPosts } = await supabase
      .from("posts")
      .select("id, title, views, likes, status")
      .eq("status", "published")
      .order("views", { ascending: false })
      .limit(5);

    const topBlogPosts =
      topPosts?.map((post) => ({
        id: post.id,
        title: post.title,
        views: post.views || 0,
        likes: post.likes || 0,
        status: post.status,
      })) || [];

    // Chart data - Loans by month (last 6 months)
    const loansByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).toISOString();

      const { data: monthLoans } = await supabase
        .from("loan_applications")
        .select("status, loan_amount")
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      const applications = monthLoans?.length || 0;
      const approved =
        monthLoans?.filter((l) => l.status === "approved").length || 0;
      const amount =
        monthLoans?.reduce(
          (sum, loan) => sum + parseFloat(loan.loan_amount || "0"),
          0
        ) || 0;

      loansByMonth.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        applications,
        approved,
        amount,
      });
    }

    // Loans by type
    const { data: loanTypes } = await supabase
      .from("loan_applications")
      .select("loan_type, loan_amount");

    const loansByType = loanTypes?.reduce((acc: any, loan: any) => {
      const type = loan.loan_type || "other";
      if (!acc[type]) {
        acc[type] = { type, count: 0, amount: 0 };
      }
      acc[type].count += 1;
      acc[type].amount += parseFloat(loan.loan_amount || "0");
      return acc;
    }, {});

    // User growth by month (last 6 months)
    const userGrowthData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).toISOString();

      const { count: monthUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      const { count: monthAgents } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "agent")
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      userGrowthData.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        users: monthUsers || 0,
        agents: monthAgents || 0,
      });
    }

    // Commission trend by month (last 6 months)
    const commissionTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();
      const monthEnd = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).toISOString();

      const { data: monthCommissions } = await supabase
        .from("loan_applications")
        .select("agent_commission, status")
        .not("agent_id", "is", null)
        .gte("created_at", monthStart)
        .lte("created_at", monthEnd);

      const monthStats = monthCommissions?.reduce(
        (acc: any, loan: any) => {
          const commission = parseFloat(loan.agent_commission || "0");
          if (loan.status === "pending") acc.pending += commission;
          else if (loan.status === "approved") acc.earned += commission;
          else if (loan.status === "rejected") acc.rejected += commission;
          return acc;
        },
        { pending: 0, earned: 0, rejected: 0 }
      ) || { pending: 0, earned: 0, rejected: 0 };

      commissionTrend.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        ...monthStats,
      });
    }

    return {
      users: {
        total: totalUsers || 0,
        active: activeUsers || 0,
        inactive: (totalUsers || 0) - (activeUsers || 0),
        newThisMonth: newUsersThisMonth || 0,
        growth: userGrowth,
      },
      loans: {
        total: totalLoans || 0,
        pending: pendingLoans || 0,
        approved: approvedLoans || 0,
        rejected: rejectedLoans || 0,
        totalAmount,
        avgAmount,
        thisMonth: loansThisMonth || 0,
        growth: loanGrowth,
      },
      agents: {
        total: totalAgents || 0,
        active: activeAgents || 0,
        inactive: (totalAgents || 0) - (activeAgents || 0),
        topPerformers,
      },
      commissions: {
        total: commissionStats.total,
        pending: commissionStats.pending,
        earned: commissionStats.earned,
        rejected: commissionStats.rejected,
        thisMonth: commissionThisMonth,
      },
      contacts: {
        total: totalContacts || 0,
        new: newContacts || 0,
        resolved: resolvedContacts || 0,
        thisMonth: contactsThisMonth || 0,
      },
      blog: {
        posts: totalPosts || 0,
        published: publishedPosts || 0,
        drafts: draftPosts || 0,
        totalViews,
        totalLikes,
        categories: totalCategories || 0,
        topPosts: topBlogPosts,
      },
      charts: {
        loansByMonth,
        loansByType: Object.values(loansByType || {}),
        userGrowth: userGrowthData,
        agentPerformance: topPerformers.slice(0, 10),
        commissionTrend,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default values in case of error
    return {
      users: {
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0,
        growth: 0,
      },
      loans: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: 0,
        avgAmount: 0,
        thisMonth: 0,
        growth: 0,
      },
      agents: {
        total: 0,
        active: 0,
        inactive: 0,
        topPerformers: [],
      },
      commissions: {
        total: 0,
        pending: 0,
        earned: 0,
        rejected: 0,
        thisMonth: 0,
      },
      contacts: {
        total: 0,
        new: 0,
        resolved: 0,
        thisMonth: 0,
      },
      blog: {
        posts: 0,
        published: 0,
        drafts: 0,
        totalViews: 0,
        totalLikes: 0,
        categories: 0,
        topPosts: [],
      },
      charts: {
        loansByMonth: [],
        loansByType: [],
        userGrowth: [],
        agentPerformance: [],
        commissionTrend: [],
      },
    };
  }
}
