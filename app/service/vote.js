const Service = require('egg').Service;

class VoteService extends Service {
  // 提交投票
  async submitVote(electionId, userId, candidateIds) {
    const { ctx, app } = this;
    
    // 检查选举是否正在进行
    const election = await ctx.model.Election.findOne({ where: { id: electionId } }, ['is_active']);
    if (!election || !election.is_active) {
      ctx.throw(400, '选择的选举不存在或未开始选举！');
    }
    
    // 获取所有候选人数量
    const candidateCount = await ctx.model.Candidate.count();
    const maxVotes = Math.max(Math.floor(candidateCount * 0.2), 2);
    
    // 检查投票数量
    if (!candidateIds || candidateIds.length === 0 || candidateIds.length > maxVotes) {
      ctx.throw(400, `每个用戶最多可以投${maxVotes}票`);
    }
    
    // 检查后续安然是否存在
    const candidates = await ctx.model.Candidate.findAll({
      where: { id: candidateIds }
    });
    
    if (candidates.length !== candidateIds.length) {
      ctx.throw(400, '请选择正确的候选人');
    }
    
    // 检查是否已经投过票了
    const existingVotes = await ctx.model.Vote.findAll({
      where: {
        user_id: userId,
        election_id: election.id
      }
    });
    
    if (existingVotes.length > 0) {
      ctx.throw(400, '您已经投过票了');
    }
    
    // 使用事务确保所有投票一起成功
    const transaction = await ctx.model.transaction();
    
    try {
      const votePromises = candidateIds.map(candidateId => {
        return ctx.model.Vote.create({
          user_id: userId,
          candidate_id: candidateId,
          election_id: election.id
        }, { transaction });
      });
      
      await Promise.all(votePromises);
      await transaction.commit();
      
      return true;
    } catch (error) {
      await transaction.rollback();
      ctx.throw(500, '投票失败，请稍后重试');
    }
  }
  
  // 获取指定选举的投票结果 (工作人员使用)
  async getResults(electionId) {
    const { ctx } = this;
    const election = await ctx.model.Election.findOne({ where: { id: electionId } }, ['title']);
    if (!election) {
      return { success: false, message: '不存在该选举' };
    }
    const votes = await ctx.model.Vote.findAll({ where: { election_id: electionId } }, ['candidate_id']);
    if (!votes || !votes.length) {
      return { success: true, data: [] };
    }
    const candidateIds = [];
    const voteCountMap = {};
    for (const vote of votes) {
      candidateIds.push(vote.candidate_id);
      voteCountMap[vote.candidate_id] = voteCountMap[vote.candidate_id] || 0;
      voteCountMap[vote.candidate_id]++;
    }

    const candidates = await ctx.model.Candidate.findAll({
      where: {
        id: candidateIds,
      }
    }, ['id', 'name', 'description']);
    const candidateMap = [];
    for (const candidate of candidates) {
      candidateMap[candidate.id] = candidate;
    }
    const result = [];
    for (const candidateId of Object.keys(voteCountMap)) {
      result.push({
        candidateName: candidateMap[candidateId].name,
        candidateDescription: candidateMap[candidateId].description,
        voteCount: voteCountMap[candidateId],
      });
    }
    return result;
  }
}

module.exports = VoteService;