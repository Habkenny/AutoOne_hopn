export default function Card({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component className={`surface ${className}`} {...props}>
      {children}
    </Component>
  );
}
