---
name: css-content-visibility-for-long-lists
description: Use CSS content-visibility for long lists to skip offscreen rendering. Use when optimizing scroll performance of long feeds or tables.
---

## CSS content-visibility for Long Lists

Apply `content-visibility: auto` to defer off-screen rendering.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Example:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map((msg) => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).
