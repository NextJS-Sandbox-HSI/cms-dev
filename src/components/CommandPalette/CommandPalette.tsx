"use client";

import * as React from "react";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useCommandPalette } from "./useCommandPalette";
import { PostSearchGroup } from "./CommandSearch";
import "./command-palette.css";

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, setIsOpen } = useCommandPalette();
  const [search, setSearch] = React.useState("");

  // Keyboard shortcut: Ctrl+K or Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsOpen]);

  const handleSelect = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="command-palette-overlay" />
        <Dialog.Content className="command-palette-content">
          <Dialog.Title className="sr-only">Command Menu</Dialog.Title>
          <Command className="command-palette" label="Command Menu">

        <div className="command-header">
          <svg className="command-icon" width="15" height="15" viewBox="0 0 15 15">
            <path
              d="M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zM6.5 0a6.5 6.5 0 104.936 10.73l3.417 3.417a.5.5 0 00.707-.707l-3.417-3.417A6.5 6.5 0 006.5 0z"
              fill="currentColor"
            />
          </svg>
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search posts, navigate pages..."
            className="command-input"
          />
        </div>

        <Command.List className="command-list">
          <Command.Empty className="command-empty">
            No results found for "{search}"
          </Command.Empty>

          {/* Navigation Group */}
          <Command.Group heading="Navigation" className="command-group">
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/"))}
              className="command-item"
            >
              <span className="command-item-icon">🏠</span>
              <span>Home</span>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/about"))}
              className="command-item"
            >
              <span className="command-item-icon">ℹ️</span>
              <span>About</span>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/admin/dashboard"))}
              className="command-item"
            >
              <span className="command-item-icon">📊</span>
              <span>Admin Dashboard</span>
            </Command.Item>
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/admin/posts/new"))}
              className="command-item"
            >
              <span className="command-item-icon">➕</span>
              <span>New Post</span>
            </Command.Item>
          </Command.Group>

          {/* Posts Group - Dynamic */}
          <PostSearchGroup search={search} onSelect={handleSelect} />

          {/* Actions Group */}
          <Command.Group heading="Actions" className="command-group">
            <Command.Item
              onSelect={() => handleSelect(() => router.push("/login"))}
              className="command-item"
            >
              <span className="command-item-icon">🔐</span>
              <span>Login</span>
            </Command.Item>
            <Command.Item
              onSelect={() => {
                setIsOpen(false);
                window.location.reload();
              }}
              className="command-item"
            >
              <span className="command-item-icon">🔄</span>
              <span>Reload Page</span>
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div className="command-footer">
          <span className="command-footer-text">
            Navigate with <kbd>↑</kbd> <kbd>↓</kbd> • Select with <kbd>↵</kbd> • Close with <kbd>ESC</kbd>
          </span>
        </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
