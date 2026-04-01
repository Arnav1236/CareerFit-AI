import { motion } from 'framer-motion';
import { Building2, Briefcase, TrendingUp, ChevronRight } from 'lucide-react';

export default function CompanyCard({ company, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="card p-6 group"
    >
      {/* Logo + name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-bold text-xl shadow-sm"
            style={{ backgroundColor: company.bgColor, color: company.color }}
          >
            {company.logo}
          </div>
          <div>
            <h3 className="font-semibold text-warm-dark text-lg">{company.name}</h3>
            <span className="text-xs text-warm-brown bg-cream-100 px-2 py-0.5 rounded-full">
              {company.domain}
            </span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full
          ${company.difficulty === 'Very High'
            ? 'bg-red-100 text-red-600'
            : 'bg-amber-100 text-amber-700'}`}>
          {company.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-warm-brown text-sm leading-relaxed mb-4">
        {company.description}
      </p>

      {/* Salary */}
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span className="text-sm font-semibold text-green-700">{company.avgSalary}</span>
        <span className="text-xs text-warm-mid">avg. package</span>
      </div>

      {/* Tech stack */}
      <div className="mb-4">
        <p className="text-xs text-warm-mid font-semibold uppercase tracking-wide mb-2">Tech Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {company.techStack.map(tech => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 rounded-lg font-medium"
              style={{ backgroundColor: company.bgColor, color: company.color }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <div>
        <p className="text-xs text-warm-mid font-semibold uppercase tracking-wide mb-2 flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          Hiring For
        </p>
        <div className="space-y-1">
          {company.openRoles.slice(0, 3).map(role => (
            <div key={role} className="flex items-center gap-1.5 text-sm text-warm-brown">
              <ChevronRight className="w-3 h-3 text-orange-400" />
              {role}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
