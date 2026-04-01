import { motion } from 'framer-motion';
import { Star, Clock, Users, ExternalLink } from 'lucide-react';

const PROVIDER_COLORS = {
  Udemy: '#A435F0',
  Coursera: '#0056D2',
  'AWS Training': '#FF9900',
  Educative: '#00B4D8',
};

export default function CourseCard({ course, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="card p-5 group flex flex-col h-full"
    >
      {/* Badge + Provider */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: PROVIDER_COLORS[course.provider] || '#666' }}
        >
          {course.provider}
        </div>
        {course.badge && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            ⭐ {course.badge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-warm-dark text-base leading-snug mb-2 group-hover:text-orange-600 transition-colors">
        {course.title}
      </h3>

      <p className="text-warm-mid text-sm mb-3">by {course.instructor}</p>

      {/* Rating + Stats */}
      <div className="flex items-center gap-3 mb-3 text-sm">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-warm-dark">{course.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-warm-brown">
          <Users className="w-3.5 h-3.5" />
          <span>{course.students}</span>
        </div>
        <div className="flex items-center gap-1 text-warm-brown">
          <Clock className="w-3.5 h-3.5" />
          <span>{course.duration}</span>
        </div>
      </div>

      {/* Level */}
      <div className="text-xs text-warm-mid mb-3">
        📚 {course.level}
      </div>

      {/* Skills covered */}
      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {course.skills.map(skill => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md font-medium border border-orange-100"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-cream-100">
        <span className="font-bold text-warm-dark">{course.price}</span>
        <a
          href={course.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
        >
          Enroll Now
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
